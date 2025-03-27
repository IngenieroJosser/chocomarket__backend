import { IsEmail, IsString } from 'class-validator';
import { Dto } from '@lib/dto/Dto';

export class ForgotPasswordDto extends Dto<ForgotPasswordDto> {
  @IsEmail()
  email: string;
}
