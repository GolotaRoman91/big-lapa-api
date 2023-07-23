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
    @Body() body: any,
  ) {
    const { description, category } = body;
    const key = await this.s3Service.uploadFile(file, description, category);
    return { imageUrl: key };
  }

  @Get('category/:category')
  async getImagesByCategory(@Param('category') category: string) {
    const images = await this.s3Service.getImagesByCategory(category);
    const imageUrls = images.map((image) => image.imageUrl);
    return imageUrls;
  }
}
