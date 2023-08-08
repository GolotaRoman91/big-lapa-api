import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MainDto {
  @IsString()
  @ApiProperty()
  first_phoneNumber: string;

  @ApiProperty()
  @IsString()
  second_phoneNumber: string;

  @ApiProperty()
  @IsString()
  email: string;
}
