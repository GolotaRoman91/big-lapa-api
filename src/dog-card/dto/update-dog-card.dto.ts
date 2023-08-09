import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsArray,
  IsOptional,
} from 'class-validator';

export class UpdateDogCardDto {
  @IsOptional()
  @IsString()
  mainPhoto?: string;

  @IsOptional()
  @IsArray()
  photos?: string[];

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  sex?: string;

  @IsOptional()
  @IsString()
  age?: string;

  @IsOptional()
  @IsBoolean()
  haschip?: boolean;

  @IsOptional()
  @IsBoolean()
  hasbreed?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsString()
  size?: string;
}
