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
  BadRequestException,
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

  // @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const { description, category } = body;
    const key = await this.s3Service.uploadFile(file, description, category);
    return { imageUrl: key };
  }

  // @UseGuards(JwtAuthGuard)
  @Post('documents')
  @UseInterceptors(FileInterceptor('document'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    if (!file) {
      throw new BadRequestException('No document uploaded');
    }

    const { description, category } = body;
    const key = await this.s3Service.uploadDocument(
      file,
      description,
      category,
    );
    return { documentUrl: key };
  }

  @Get('category/:category')
  async getImagesByCategory(@Param('category') category: string) {
    const images = await this.s3Service.getImagesByCategory(category);
    const imageUrls = images.map((image) => image.imageUrl);
    return imageUrls;
  }

  @Get('documents/category/:category')
  async getDocumentsByCategory(@Param('category') category: string) {
    const documents = await this.s3Service.getDocumentsByCategory(category);
    const documentUrls = documents.map((document) => document.documentURI);
    return documentUrls;
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':key')
  async deleteImage(@Param('key') key: string) {
    await this.s3Service.deleteFile(key);
    return { message: 'File deleted successfully' };
  }

  // @UseGuards(JwtAuthGuard)
  @Delete('documents/:key')
  async deleteFile(@Param('key') key: string) {
    await this.s3Service.deleteDocument(key);
    return { message: 'File deleted successfully' };
  }
}
