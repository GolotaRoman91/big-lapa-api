import { Body, Controller, Post } from '@nestjs/common';
import { MainService } from './mainPage.service';
import { MainDto } from './dto/mainPage.dto';

@Controller('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Post('create')
  async create(@Body() dto: MainDto) {
    return this.mainService.create(dto);
  }
}
