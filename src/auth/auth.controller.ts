import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { ALREADY_REGISTERED_ERROR } from './authConstants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //   @UsePipes(new ValidationPipe())
  //   @Post('register')
  //   async register(@Body() dto: AuthDto) {
  //     const oldUser = await this.authService.findUser(dto.login);
  //     if (oldUser) {
  //       throw new BadRequestException(ALREADY_REGISTERED_ERROR);
  //     }
  //     return this.authService.createUser(dto);
  //   }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() { login, password }: AuthDto) {
    const { userName } = await this.authService.validateUser(login, password);
    return this.authService.login(userName);
  }
}
