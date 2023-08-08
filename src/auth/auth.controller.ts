import { AuthService } from './auth.service'
import {
  Body,
  Controller,
  Post,
  BadRequestException,
  HttpCode,
  UseGuards,
  Patch,
} from '@nestjs/common'
import { AuthDto } from './dto/auth.dto'
import { ALREADY_REGISTERED_ERROR } from './authConstants'
import { JwtAuthGuard } from './guards/jwt.guard'
import { UserName } from 'src/decorators/user.decorator'
import { LoginResponseDto } from './dto/loginResonse.dto'
import { ApiTags } from '@nestjs/swagger'
import { ApiTagController } from 'src/shared/decorators/ApiTagController'

@ApiTagController('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}
  @Post('register')
  async register (@Body() dto: AuthDto) {
    const oldUser = await this.authService.findUser(dto.login)
    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR)
    }
    return this.authService.createUser(dto)
  }

  @HttpCode(200)
  @Post('login')
  async login (@Body() { login, password }: AuthDto): Promise<LoginResponseDto> {
    const { userName } = await this.authService.validateUser(login, password)
    return this.authService.login(userName)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword (
    @UserName() userName: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    await this.authService.changePassword(userName, oldPassword, newPassword)
    return { message: 'Password changed' }
  }
}
