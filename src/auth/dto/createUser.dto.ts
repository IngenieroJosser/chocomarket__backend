import { IsEmail, IsString, Length } from 'class-validator';
import { Dto } from '../../lib/dto/Dto';

export class RegisterDto extends Dto<RegisterDto> {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  address: string;

  @IsString()
  @Length(6, 20)
  password: string;
}
