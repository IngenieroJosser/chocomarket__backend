import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDto } from './dto/createUser.dto';
import { UserAuthenticatedDto } from './dto/userAuthenticated.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { randomBytes } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService,
              private readonly mailService: MailService,
              private readonly jwtService: JwtService,
  ) {}

  async registerUser(dto: RegisterDto) {
    const foundUser = await this.prisma.user.findUnique({
      where: { email: dto.email } 
    });

    if (foundUser) {
      throw new BadRequestException('El correo ya existe.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const createUser = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      }
    });

    // Opcional: no devolver el password
    const { password, ...rest } = createUser;
    return rest;
  }

  async authenticatedUser(dto: UserAuthenticatedDto) {
    const foundUserAuthenticated = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!foundUserAuthenticated) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, foundUserAuthenticated.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    // Creo el payload (puedo agregar más campos si necesito)
    const payload = {
      sub: foundUserAuthenticated.id,
      email: foundUserAuthenticated.email,
    };

    // Genero el token
    const token = this.jwtService.sign(payload);

    return {
      token, // aquí lo devolvo
      user: {
        id: foundUserAuthenticated.id,
        email: foundUserAuthenticated.email,
        name: foundUserAuthenticated.name, // si tienes otros campos puedo agregarlos
      },
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    });
  
    if (!foundUser) throw new Error('Email no encontrado');
  
    // Crear OTP y expiración
    const otp = randomBytes(3).toString('hex'); // Ej: "a3f9c1"
    const expiry = new Date(Date.now() + 1000 * 60 * 10); // 10 minutos
  
    // Guardar en la BD
    await this.prisma.user.update({
      where: { email: dto.email },
      data: {
        resetToken: otp,
        resetTokenExpiry: expiry
      }
    });
  
    // Enviar por correo
    await this.mailService.sendOtp({
      email: dto.email,
      otp: otp,
    });
  
    return { message: 'Se ha enviado un código OTP a tu correo' };
  }
  
  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.prisma.user.findUnique({
      where: { 
        email: dto.email 
      }
    });

    if (!user || !user.resetToken || !user.resetTokenExpiry) throw new Error('OTP inválido o expirado');
    
    if (user.resetToken !== dto.otp || user.resetTokenExpiry < new Date()) throw new Error('OTP inválido o expirado');

    return { message: 'OTP válido' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (!user || !user.resetToken || !user.resetTokenExpiry) throw new Error('OTP inválido o expirado');
    
    if (user.resetToken !== dto.otp || user.resetTokenExpiry < new Date()) throw new Error('OTP inválido o expirado');    

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { email: dto.email },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    return { message: 'Contraseña actualizada correctamente' };
  }
}
