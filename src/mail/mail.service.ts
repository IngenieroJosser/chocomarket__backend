// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { VerifyOtpDto } from 'src/auth/dto/verifyOtp.dto';
import { RegisterDto } from 'src/auth/dto/createUser.dto';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class MailService {
  constructor() {}

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    secure: true,
    port: 465,
  });  

  // Mi correo para nodemailer es cordobarivasjosser11@gmail.com
  async sendOtp(dataMail: VerifyOtpDto) {
    const mailOptions = {
      from: 'ChocóMarket <cordobarivasjosser11@gmail.com>',
      to: dataMail.email,
      subject: 'Código OTP para reestablecer tu contraseña',
      text: `Tu código OTP es: ${dataMail.otp}. Este código expira en 10 minutos.`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
            <div style="background-color: #008060; padding: 10px 20px; text-align: center;">
              <!-- Reemplaza el texto por una imagen inline -->
              <img src="cid:logo" alt="ChocóMarket" style="max-width: 150px;">
            </div>
            <div style="padding: 20px; color: #5A3E29;">
              <p style="font-size: 16px;">Hola ${dataMail.email},</p>
              <p style="font-size: 16px;">
                Tu código OTP es: <strong style="color: #ff0000;">${dataMail.otp}</strong>
              </p>
              <p style="font-size: 16px;">Este código expirará en 10 minutos.</p>
              <p style="font-size: 14px; color: #777;">Si no solicitaste este código, ignora este mensaje.</p>
            </div>
            <div style="background-color: #f1f1f1; padding: 10px 20px; text-align: center; font-size: 12px; color: #777;">
              <p>&copy; ${new Date().getFullYear()} ChocóMarket. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'logo.png',
          path: 'src/img/logo.png', // ruta en tu servidor
          cid: 'logo', // el mismo identificador que usas en el src de la imagen
        },
      ],
    };        
    await this.transporter.sendMail(mailOptions);
  }
}
