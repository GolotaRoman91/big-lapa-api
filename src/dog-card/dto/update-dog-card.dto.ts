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

export class UpdateDogCardDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mainPhoto?: string;

  @ApiProperty({ required: false, type: [DogPhotoType] })
  @IsOptional()
  @IsArray()
  photos?: Ref<DogPhotoType>[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sex?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  age?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  haschip?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasbreed?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  breed?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  size?: string;
}
