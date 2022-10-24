import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  account: string;
  @IsString()
  password: string;
}
