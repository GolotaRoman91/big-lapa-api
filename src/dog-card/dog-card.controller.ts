import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { DogCard } from './dog-card.model';
import { DogCardService } from './dog-card.service';
import { Response } from 'express';

@Controller('dog-cards')
export class DogCardController {
  constructor(private readonly dogCardService: DogCardService) {}

  @Post()
  async createDogCard(@Body() data: DogCard): Promise<DogCard> {
    return this.dogCardService.createDogCard(data);
  }

  @Get()
  async getAllDogCards(): Promise<DogCard[]> {
    return this.dogCardService.getAllDogCards();
  }

  @Get(':id')
  async getDogCardById(@Param('_id') id: number): Promise<DogCard | null> {
    return this.dogCardService.getDogCardById(id);
  }

  @Delete(':id')
  async deleteDogCard(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.dogCardService.deleteDogCardById(id);
    res.status(200).json({ message: 'Dog card deleted successfully' });
  }
}
