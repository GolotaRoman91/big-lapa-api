import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MainDto {
  @ApiProperty()
  @IsString()
  first_phoneNumber: string;

  @ApiProperty()
  @IsString()
  second_phoneNumber: string;

  @ApiProperty()
  @IsString()
  email: string;
}
