import {
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
  Res,
  BadRequestException,
  Body,
  UploadedFile,
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import * as mimeTypes from 'mime-types'

import { BackblazeService } from './backblaze.service'
import { ValidateUploadFiels } from './decorators/validate.upload.files.decorator'
import { FileService } from '../files/file.service'
import { extname } from 'path'
import { ConfigService } from '@nestjs/config'
import { IEnv } from 'src/configs/env.config'

const singleExtensionRegex = /^[^.]+\.[a-zA-Z0-9]+$/

@Controller('files')
export class BackBlazeController {
  constructor (
    private readonly backblazeService: BackblazeService,
    private readonly fileService: FileService,
    private readonly configService: ConfigService<IEnv>,
  ) {}
  @Post('images')
  @UseInterceptors(FilesInterceptor('images', 6))
  async uploadImage (
    @ValidateUploadFiels(2_097_152, 'image')
    images: Express.Multer.File[],
  ) {
    if (!images) {
      throw new BadRequestException('No files uploaded')
    }
    const links = await Promise.all(
      images.map(image =>
        // this.fileService.convertToWebP(image.buffer, image.originalname),
        this.backblazeService.uploadFile(image.buffer, image.originalname),
      ),
    )
    return links
  }

  @Post('documents')
  @UseInterceptors(
    FileInterceptor('document', {
      fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.txt', '.pdf', '.doc']
        const fileExtension = extname(file.originalname)
        const mimeType = mimeTypes.lookup(fileExtension)

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
            )
            return
          }

          cb(null, true)
        } else {
          cb(
            new BadRequestException(
              'Only .txt, .doc, and .pdf files are allowed',
            ),
            false,
          )
        }
      },
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  async uploadDocument (@UploadedFile() document: Express.Multer.File) {
    if (!document) {
      throw new BadRequestException('No files uploaded')
    }
    const link = await this.backblazeService.uploadFile(
      document.buffer,
      document.originalname,
      'Document',
    )
    return link
  }

  @Get(':url')
  async getFileByUrl (@Param('url') url: string, @Res() response: Response) {
    ;(await this.backblazeService.getFile(url)).pipe(response)
  }

  @Get('/document/:url')
  async getDocumentByUrl (@Param('url') url: string, @Res() response: Response) {
    const getFileName = await this.backblazeService.getFileInfo(url)
    console.log(getFileName.name)
    response.setHeader('Content-Type', 'application/octet-stream')
    response.setHeader(
      'Content-Disposition',
      `attachment; filename=${encodeURI(getFileName.name)}`,
    )
    ;(await this.backblazeService.getFile(url)).pipe(response)
  }
}
