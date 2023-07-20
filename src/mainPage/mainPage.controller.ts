import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MainService } from './mainPage.service';
import { MainDto } from './dto/mainPage.dto';
import { MainModel } from './mainPage.model/mainPage.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileElementResponse } from './dto/file-element.response';
import { MFile } from './dto/mfile.class';

@Controller('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Post('create')
  async create(@Body() dto: MainDto) {
    return this.mainService.create(dto);
  }

  @Post('upload')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('files'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileElementResponse[]> {
    const saveArray: MFile[] = [file];
    if (file.mimetype.includes('image')) {
      const buffer = await this.mainService.convertToWebP(file.buffer);
      saveArray.push(
        new MFile({
          originalname: `${file.originalname.split('.')[0]}.webp`,
          buffer,
        }),
      );
    }
    return this.mainService.saveFiles(saveArray);
  }

  @Get('get')
  async getMainData(): Promise<MainModel> {
    return this.mainService.getMainData();
  }
}
