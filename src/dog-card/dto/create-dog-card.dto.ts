import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateDogCardDto {
  @IsNotEmpty()
  @IsString()
  mainPhoto: string;

  @IsNotEmpty()
  @IsArray()
  photos: string[];

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  sex: string;

  @IsNotEmpty()
  @IsString()
  age: string;

  @IsNotEmpty()
  @IsBoolean()
  haschip: boolean;

  @IsNotEmpty()
  @IsBoolean()
  hasbreed: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsNotEmpty()
  @IsString()
  size: string;
}
