import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [AuthModule, PrismaModule, MailModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
