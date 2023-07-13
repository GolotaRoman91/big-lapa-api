import { Injectable } from '@nestjs/common';
import { DocumentType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { MainModel } from './mainPage.model/mainPage.model';
import { Model } from 'mongoose';
import { MainDto } from './dto/mainPage.dto';
import { getModelForClass } from '@typegoose/typegoose'; // Import from the correct path

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
}
