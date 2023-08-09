import {
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
  Res,
  BadRequestException,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'

import { BackblazeService } from './backblaze.service'
import { ValidateUploadFiels } from './decorators/validate.upload.files.decorator'
@Controller('files')
export class BackBlazeController {
  constructor (private readonly backblazeService: BackblazeService) {}
  @Post('images')
  @UseInterceptors(FilesInterceptor('images', 5))
  async uploadImage (
    @ValidateUploadFiels(2_097_152, 'image')
    images: Express.Multer.File[],
  ) {
    if (!images) {
      throw new BadRequestException('No files uploaded')
    }
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
    ;(await this.backblazeService.getFile(id)).pipe(response)
  }
}
