// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { VerifyOtpDto } from 'src/auth/dto/verifyOtp.dto';
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
      html: `<p><strong>Tu código OTP:</strong> ${dataMail.otp}</p><p>Este código expirará en 10 minutos.</p>`
    };

    await this.transporter.sendMail(mailOptions);
  }
}
