import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Res,
  NotFoundException,
  HttpException,
  HttpStatus,
  ValidationPipe,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { DogCard } from './dog-card.model';
import { DogCardService } from './dog-card.service';
import { Response } from 'express';
import { CreateDogCardDto } from './dto/create-dog-card.dto';
import { UpdateDogCardDto } from './dto/update-dog-card.dto';

@Controller('dog-cards')
export class DogCardController {
  constructor(private readonly dogCardService: DogCardService) {}

  @Post()
  async createDogCard(
    @Body(new ValidationPipe()) data: CreateDogCardDto,
  ): Promise<DogCard> {
    try {
      return this.dogCardService.createDogCard(data);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(
          { message: 'Validation failed', errors: error.getResponse() },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async updateDogCard(
    @Param('id') id: string,
    @Body(new ValidationPipe()) data: UpdateDogCardDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const updatedDogCard = await this.dogCardService.updateDogCard(id, data);

      if (!updatedDogCard) {
        res.status(404).json({ message: `Dog card with id ${id} not found` });
      } else {
        res.status(200).json(updatedDogCard);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).json({ message: error.message });
      } else if (error instanceof BadRequestException) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An error occurred' });
      }
    }
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
