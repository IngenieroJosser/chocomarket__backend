import { IsEmail, IsString, MinLength } from 'class-validator';
import { Dto } from '@lib/dto/Dto';

export class ResetPasswordDto extends Dto<ResetPasswordDto> {
  @IsEmail()
  email: string;

  @IsString()
  otp: string;

  @MinLength(6)
  newPassword: string;
}
