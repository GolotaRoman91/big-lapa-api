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
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import * as mimeTypes from 'mime-types';
import { extname, parse } from 'path';
import { UploadImageDto } from './dto/uploadImage.dto';
import { UploadDocumentDto } from './dto/uploadDocument.dto';

const singleExtensionRegex = /^[^.]+\.[a-zA-Z0-9]+$/;
const logger = new Logger();

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
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file: Express.Multer.File, cb) => {
        logger.log(`File mimetype: ${file.mimetype}`);
        if (
          file &&
          (file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/vnd.microsoft.icon')
        ) {
          if (!singleExtensionRegex.test(file.originalname)) {
            cb(
              new BadRequestException(
                'Invalid file name. Double extensions are not allowed.',
              ),
              false,
            );
            return;
          }

          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Only .JPEG .ICO and .PNG images are allowed',
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadImageDto,
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
  @UseInterceptors(
    FileInterceptor('document', {
      fileFilter: (req, file, cb) => {
        logger.log(`File mimetype: ${file.mimetype}`);
        const allowedExtensions = ['.txt', '.pdf', '.doc'];
        const fileExtension = extname(file.originalname);
        const mimeType = mimeTypes.lookup(fileExtension);

        if (
          allowedExtensions.includes(fileExtension) &&
          (mimeType === 'text/plain' ||
            mimeType === 'application/pdf' ||
            mimeType === 'application/msword')
        ) {
          if (!singleExtensionRegex.test(file.originalname)) {
            cb(
              new BadRequestException(
                'Invalid file name. Double extensions are not allowed.',
              ),
              false,
            );
            return;
          }

          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Only .txt, .doc, and .pdf files are allowed',
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadDocumentDto,
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
    return { message: 'Image deleted successfully' };
  }

  // @UseGuards(JwtAuthGuard)
  @Delete('documents/:key')
  async deleteFile(@Param('key') key: string) {
    await this.s3Service.deleteDocument(key);
    return { message: 'Document deleted successfully' };
  }
}
