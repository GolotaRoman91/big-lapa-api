import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Res,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('images')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Get(':key')
  async getImage(@Param('key') key: string, @Res() res: Response) {
    const fileStream = this.s3Service.getFileStream(key);
    fileStream.pipe(res);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Delete(':key')
  async deleteImage(@Param('key') key: string) {
    await this.s3Service.deleteFile(key);
    return { message: 'File deleted successfully' };
  }
}
