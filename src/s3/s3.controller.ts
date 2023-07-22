import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
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
    @Body('description') description: string,
  ) {
    // Примените фильтры и изменения размера здесь, если необходимо
    const key = await this.s3Service.uploadFile(file);
    return { imagePath: `/images/${key}` };
  }
}
