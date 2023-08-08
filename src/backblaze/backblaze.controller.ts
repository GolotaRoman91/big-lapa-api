import timers from 'node:timers/promises'
import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Body,
  Res,
  Delete,
  UseGuards,
  BadRequestException,
  Logger,
  ParseFilePipeBuilder,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import * as mimeTypes from 'mime-types'
import { extname, parse } from 'path'
import { S3Service } from 'src/s3/s3.service'
import { UploadImageDto } from 'src/s3/dto/uploadImage.dto'
import { UploadDocumentDto } from 'src/s3/dto/uploadDocument.dto'
import { BackblazeService } from './backblaze.service'
import { ParseFilesPipe } from './pipes/parse-files.pipe'

const singleExtensionRegex = /^[^.]+\.[a-zA-Z0-9]+$/
const imagesRegex = new RegExp(/^jpeg|png|jpg|vnd.microsoft.icon$/gm)
const logger = new Logger()

@Controller('files')
export class BackBlazeController {
  constructor (private readonly backblazeService: BackblazeService) {}
  @Post('image')
  @UseInterceptors(FilesInterceptor('images', 5))
  async uploadImage (
    @UploadedFiles(
      new ParseFilesPipe(
        new ParseFilePipe({
          fileIsRequired: true,
          validators: [
            new MaxFileSizeValidator({ maxSize: 2_097_152 }),
            new FileTypeValidator({
              fileType: 'image',
            }),
          ],
        }),
      ),
    )
    images: Express.Multer.File[],
    @Body() body: UploadImageDto,
  ) {
    if (!images) {
      throw new BadRequestException('No files uploaded')
    }
    console.log(images)
    const res = await Promise.all(
      images.map(image =>
        this.backblazeService.uploadFile(
          'Image',
          image.buffer,
          image.originalname,
        ),
      ),
    )
    console.log(res)
    return 'ok'
  }

  @Get(':id')
  async getFileById (@Param('id') id: string, @Res() response: Response) {
    (await this.backblazeService.getFile(id)).pipe(response)
  }
}
