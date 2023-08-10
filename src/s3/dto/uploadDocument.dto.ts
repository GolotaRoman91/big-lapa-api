import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadDocumentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsIn(['category1', 'category2', 'category3'])
  category: string;
}
