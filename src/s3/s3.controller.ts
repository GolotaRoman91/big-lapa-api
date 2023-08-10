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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

const singleExtensionRegex = /^[^.]+\.[a-zA-Z0-9]+$/;
const logger = new Logger();

@Controller('images')
@ApiTags('images')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @ApiOperation({ summary: 'Get an image by key' })
  @ApiParam({ name: 'key', description: 'Image key' })
  @ApiOkResponse({ description: 'Image retrieved successfully' })
  @ApiInternalServerErrorResponse({ description: 'An error occurred' })
  @Get(':key')
  async getImage(@Param('key') key: string, @Res() res: Response) {
    const fileStream = await this.s3Service.getFileStream(key);
    fileStream.pipe(res);
  }

  @ApiOperation({ summary: 'Get a document by key' })
  @ApiParam({ name: 'key', description: 'Document key' })
  @ApiOkResponse({ description: 'Document retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Document not found' })
  @ApiInternalServerErrorResponse({ description: 'An error occurred' })
  @Get('documents/:key')
  async getDocument(@Param('key') key: string, @Res() res: Response) {
    try {
      const fileStream = await this.s3Service.getFileStream(key);

      const mimeType = mimeTypes.lookup(key);

      if (!mimeType) {
        res.setHeader('Content-Type', 'application/octet-stream');
      } else {
        res.setHeader('Content-Type', mimeType);
      }

      res.setHeader('Content-Disposition', `attachment; filename=${key}`);
      fileStream.pipe(res);
    } catch (error) {
      return res.status(404).json({ message: 'Document not found' });
    }
  }

  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload an image' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid file or format' })
  @ApiInternalServerErrorResponse({ description: 'An error occurred' })
  @ApiBody({ type: UploadImageDto })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Image uploaded successfully' })
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
  @ApiOperation({ summary: 'Upload a document' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid file or format' })
  @ApiInternalServerErrorResponse({ description: 'An error occurred' })
  @ApiBody({ type: UploadDocumentDto })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Document uploaded successfully' })
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

  @ApiOperation({ summary: 'Get images by category' })
  @ApiParam({ name: 'category', description: 'Category of images' })
  @ApiOkResponse({ description: 'Images retrieved successfully' })
  @ApiInternalServerErrorResponse({ description: 'An error occurred' })
  @Get('category/:category')
  async getImagesByCategory(@Param('category') category: string) {
    const images = await this.s3Service.getImagesByCategory(category);
    const imageUrls = images.map((image) => image.imageUrl);
    return imageUrls;
  }

  @ApiOperation({ summary: 'Get documents by category' })
  @ApiParam({ name: 'category', description: 'Category of documents' })
  @ApiOkResponse({ description: 'Documents retrieved successfully' })
  @ApiInternalServerErrorResponse({ description: 'An error occurred' })
  @Get('documents/category/:category')
  async getDocumentsByCategory(
    @Param('category') category: string,
    @Res() res: Response,
  ) {
    try {
      const documents = await this.s3Service.getDocumentsByCategory(category);
      const documentUrls = documents.map((document) => document.documentURI);
      return res.json(documentUrls);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error while fetching documents', error });
    }
  }

  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete an image' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'An error occurred' })
  @ApiBearerAuth()
  @ApiParam({ name: 'key', description: 'Image key' })
  @ApiOkResponse({ description: 'Image deleted successfully' })
  @ApiNotFoundResponse({ description: 'Image not found' })
  @Delete(':key')
  async deleteImage(@Param('key') key: string) {
    await this.s3Service.deleteFile(key);
    return { message: 'Image deleted successfully' };
  }

  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a document' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'An error occurred' })
  @ApiBearerAuth()
  @ApiParam({ name: 'key', description: 'Document key' })
  @ApiOkResponse({ description: 'Document deleted successfully' })
  @ApiNotFoundResponse({ description: 'Document not found' })
  @Delete('documents/:key')
  async deleteFile(@Param('key') key: string) {
    await this.s3Service.deleteDocument(key);
    return { message: 'Document deleted successfully' };
  }
}
