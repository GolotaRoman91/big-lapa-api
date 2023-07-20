import { Injectable } from '@nestjs/common';
import { DocumentType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { MainModel } from './mainPage.model/mainPage.model';
import { Model } from 'mongoose';
import { MainDto } from './dto/mainPage.dto';
import { getModelForClass } from '@typegoose/typegoose';
import { FileElementResponse } from './dto/file-element.response';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { MFile } from './dto/mfile.class';

@Injectable()
export class MainService {
  constructor(
    @InjectModel(MainModel)
    private readonly mainModel: Model<MainModel>,
  ) {}

  async create(dto: MainDto): Promise<DocumentType<MainModel>> {
    const model = getModelForClass(MainModel);
    return model.findOneAndUpdate({}, dto, { upsert: true, new: true });
  }

  async saveFiles(files: MFile[]): Promise<FileElementResponse[]> {
    const dateFolder = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${path}/uploads/${dateFolder}`;
    await ensureDir(uploadFolder);
    const res: FileElementResponse[] = [];

    for (const file of files) {
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
      res.push({
        url: `${dateFolder}/${file.originalname}`,
        name: file.originalname,
      });
      return res;
    }
  }

  convertToWebP(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }

  async getMainData(): Promise<MainModel> {
    return this.mainModel.findOne();
  }
}
