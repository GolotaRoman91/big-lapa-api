import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';

@Controller('images')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Get(':key')
  getImage(@Param('key') key: string) {
    return this.s3Service.getFileStream(key);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any, // Получите все значения из тела запроса
  ) {
    const { description, category } = body; // Извлеките значения description и category из body
    const key = await this.s3Service.uploadFile(file, description, category);
    return { imagePath: `/images/${key}` };
  }
}
