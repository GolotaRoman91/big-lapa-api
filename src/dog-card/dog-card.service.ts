import { Injectable, NotFoundException } from '@nestjs/common';
import { DogCard } from './dog-card.model';
import { InjectModel } from 'nestjs-typegoose';
import { Model } from 'mongoose';
import { UpdateDogCardDto } from './dto/update-dog-card.dto';

@Injectable()
export class DogCardService {
  constructor(@InjectModel(DogCard) private dogCardModel: Model<DogCard>) {}

  async createDogCard(data: DogCard): Promise<DogCard> {
    const createdDogCard = await this.dogCardModel.create(data);
    return createdDogCard.toObject();
  }

  async updateDogCard(
    id: string,
    data: UpdateDogCardDto,
  ): Promise<DogCard | null> {
    const existingDogCard = await this.dogCardModel.findById(id).exec();

    if (!existingDogCard) {
      throw new NotFoundException(`Dog card with id ${id} not found`);
    }

    existingDogCard.name =
      data.name !== undefined ? data.name : existingDogCard.name;
    existingDogCard.sex =
      data.sex !== undefined ? data.sex : existingDogCard.sex;
    existingDogCard.age =
      data.age !== undefined ? data.age : existingDogCard.age;
    existingDogCard.breed =
      data.breed !== undefined ? data.breed : existingDogCard.breed;
    existingDogCard.size =
      data.size !== undefined ? data.size : existingDogCard.size;
    existingDogCard.mainPhoto =
      data.mainPhoto !== undefined ? data.mainPhoto : existingDogCard.mainPhoto;
    existingDogCard.photos =
      data.photos !== undefined ? data.photos : existingDogCard.photos;

    const updatedDogCard = await existingDogCard.save();
    return updatedDogCard.toObject();
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
