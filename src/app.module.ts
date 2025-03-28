import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { JwtModule } from './auth/jwt/jwt.module';

@Module({
  imports: [AuthModule, PrismaModule, MailModule, JwtModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
