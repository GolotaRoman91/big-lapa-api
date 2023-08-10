import { Body, Controller, Get, Post } from '@nestjs/common';
import { MainService } from './mainPage.service';
import { MainDto } from './dto/mainPage.dto';
import { MainModel } from './mainPage.model/mainPage.model';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';

@Controller('main')
@ApiTags('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @ApiOperation({ summary: 'Create main page data' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiInternalServerErrorResponse({ description: 'An error occurred' })
  @ApiBody({ type: MainDto })
  @ApiResponse({
    status: 201,
    description: 'Main page data created successfully',
    type: MainModel,
  })
  @Post('create')
  async create(@Body() dto: MainDto): Promise<MainModel> {
    return this.mainService.create(dto);
  }

  @ApiOperation({ summary: 'Get main page data' })
  @ApiOkResponse({
    description: 'Main page data retrieved successfully',
    type: MainModel,
  })
  @ApiInternalServerErrorResponse({ description: 'An error occurred' })
  @Get('get')
  async getMainData(): Promise<MainModel> {
    return this.mainService.getMainData();
  }
}
