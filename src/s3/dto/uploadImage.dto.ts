import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadImageDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsIn(['category1', 'category2', 'category3'])
  category: string;
}
