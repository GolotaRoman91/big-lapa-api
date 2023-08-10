import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Res,
  Patch,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { DogCard } from './models/dog-card.model';
import { DogCardService } from './dog-card.service';
import { Response } from 'express';
import { CreateDogCardDto } from './dto/create-dog-card.dto';
import { UpdateDogCardDto } from './dto/update-dog-card.dto';

@Controller('dog-cards')
@ApiTags('dog-cards')
export class DogCardController {
  constructor(private readonly dogCardService: DogCardService) {}

  @ApiOperation({ summary: 'Create a new dog card' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiInternalServerErrorResponse({ description: 'An error occurred' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateDogCardDto })
  @ApiResponse({
    status: 201,
    description: 'Dog card created successfully',
    type: DogCard,
  })
  @Post()
  async createDogCard(@Body() data: CreateDogCardDto): Promise<DogCard> {
    return this.dogCardService.createDogCard(data);
  }

  @ApiOperation({ summary: 'Update a dog card by ID' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiNotFoundResponse({ description: 'Dog card not found' })
  @ApiInternalServerErrorResponse({ description: 'An error occurred' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Dog card ID' })
  @ApiBody({ type: UpdateDogCardDto })
  @ApiOkResponse({
    description: 'Dog card updated successfully',
    type: DogCard,
  })
  @Patch(':id')
  async updateDogCard(
    @Param('id') id: string,
    @Body() data: UpdateDogCardDto,
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

  @ApiOperation({ summary: 'Get all dog cards' })
  @ApiOkResponse({ description: 'List of all dog cards', type: [DogCard] })
  @ApiInternalServerErrorResponse({ description: 'An error occurred' })
  @Get()
  async getAllDogCards(): Promise<DogCard[]> {
    return this.dogCardService.getAllDogCards();
  }

  @ApiOperation({ summary: 'Get a dog card by ID' })
  @ApiNotFoundResponse({ description: 'Dog card not found' })
  @ApiInternalServerErrorResponse({ description: 'An error occurred' })
  @ApiParam({ name: 'id', description: 'Dog card ID' })
  @ApiOkResponse({ description: 'Dog card found', type: DogCard })
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

  @ApiOperation({ summary: 'Delete a dog card by ID' })
  @ApiNotFoundResponse({ description: 'Dog card not found' })
  @ApiInternalServerErrorResponse({ description: 'An error occurred' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Dog card ID' })
  @ApiOkResponse({ description: 'Dog card deleted successfully' })
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
