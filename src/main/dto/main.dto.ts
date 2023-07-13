import { IsString } from 'class-validator';

export class MainDto {
  @IsString()
  first_phoneNumber: string;

  @IsString()
  second_phoneNumber: string;

  @IsString()
  email: string;
}
