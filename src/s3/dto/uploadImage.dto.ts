import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UploadImageDto {
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsIn(['category1', 'category2', 'category3'])
  category: string;
}
