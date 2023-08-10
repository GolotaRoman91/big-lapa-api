import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsArray,
  IsOptional,
} from 'class-validator';
import { DogPhotoType } from '../models/dog-photo-type.model';
import { Ref } from '@typegoose/typegoose';

export class CreateDogCardDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mainPhoto: string;

  @ApiProperty({ type: [DogPhotoType] })
  @IsNotEmpty()
  @IsArray()
  photos: Ref<DogPhotoType>[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sex: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  age: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  haschip: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  hasbreed: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  breed?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  size: string;
}
