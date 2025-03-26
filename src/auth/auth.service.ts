import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async registerUser(dto: RegisterDto) {
    const foundUser = await this.prisma.user.findUnique({ 
      where: { email: dto.email } 
    });

    if (foundUser) {
      throw new BadRequestException('El correo ya existe.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      }
    });

    // Opcional: no devolver el password
    const { password, ...rest } = newUser;
    return rest;
  }
}
