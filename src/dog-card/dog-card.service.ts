import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getDogCardById(id: string): Promise<DogCard | null> {
    const dogCard = await this.dogCardModel.findById(id).exec();

    if (!dogCard) {
      throw new NotFoundException(`Dog card with id ${id} not found`);
    }

    return dogCard;
  }

  async getAllDogCards(): Promise<DogCard[]> {
    const allDogCards = await this.dogCardModel.find().exec();
    return allDogCards;
  }

  async deleteDogCardById(id: string): Promise<void> {
    const dogCard = await this.dogCardModel.findById(id).exec();

    if (!dogCard) {
      throw new NotFoundException(`Dog card with id ${id} not found`);
    }
    await this.dogCardModel.findByIdAndDelete(id).exec();
  }
}
