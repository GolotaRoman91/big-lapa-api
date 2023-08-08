import { Injectable } from '@nestjs/common';
import { DogCard } from './dog-card.model';
import { InjectModel } from 'nestjs-typegoose';
import { Model } from 'mongoose';

@Injectable()
export class DogCardService {
  constructor(@InjectModel(DogCard) private dogCardModel: Model<DogCard>) {}

  async createDogCard(data: DogCard): Promise<DogCard> {
    const createdDogCard = await this.dogCardModel.create(data);
    return createdDogCard.toObject();
  }

  async getDogCardById(id: number): Promise<DogCard | null> {
    const dogCard = await this.dogCardModel.findOne({ id }).exec();
    return dogCard;
  }

  async getAllDogCards(): Promise<DogCard[]> {
    const allDogCards = await this.dogCardModel.find().exec();
    return allDogCards;
  }

  async deleteDogCardById(id: string): Promise<void> {
    await this.dogCardModel.findByIdAndDelete(id).exec();
  }
}
