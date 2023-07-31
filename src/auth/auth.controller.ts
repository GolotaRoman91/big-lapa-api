import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  HttpCode,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { ALREADY_REGISTERED_ERROR } from './authConstants';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UserName } from 'src/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const oldUser = await this.authService.findUser(dto.login);
    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }
    return this.authService.createUser(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() { login, password }: AuthDto) {
    const { userName } = await this.authService.validateUser(login, password);
    return this.authService.login(userName);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(
    @UserName() userName: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.changePassword(userName, oldPassword, newPassword);
  }
}
