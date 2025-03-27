import { IsEmail, IsString, Length } from 'class-validator';
import { Dto } from '@lib/dto/Dto';

export class UserAuthenticatedDto extends Dto<UserAuthenticatedDto> {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;
}