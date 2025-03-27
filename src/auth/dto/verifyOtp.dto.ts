import { IsEmail, IsString } from 'class-validator';
import { Dto } from '@lib/dto/Dto';

export class VerifyOtpDto extends Dto<VerifyOtpDto> {
  @IsEmail()
  email: string;

  @IsString()
  otp: string;
}
