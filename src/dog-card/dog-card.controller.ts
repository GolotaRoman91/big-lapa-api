import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Res,
  NotFoundException,
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
  async getDogCardById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const dogCard = await this.dogCardService.getDogCardById(id);

      if (!dogCard) {
        res.status(404).json({ message: `Dog card with id ${id} not found` });
      } else {
        res.status(200).json(dogCard);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An error occurred' });
      }
    }
  }

  @Delete(':id')
  async deleteDogCard(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.dogCardService.deleteDogCardById(id);
      res.status(200).json({ message: 'Dog card deleted successfully' });
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An error occurred' });
      }
    }
  }
}
