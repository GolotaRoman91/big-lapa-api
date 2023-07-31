import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './auth.model/auth.model';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import { genSalt, hash, compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './authConstants';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: Model<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async findUser(userName: string) {
    return this.userModel.findOne({ userName }).exec();
  }

  async createUser(dto: AuthDto) {
    const salt = await genSalt(10);
    const newUser = new this.userModel({
      userName: dto.login,
      passwordHash: await hash(dto.password, salt),
    });
    return newUser.save();
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserModel, 'userName'>> {
    const user = await this.findUser(email);
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }

    const isCorrectPassword = await compare(password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }
    return { userName: user.userName };
  }

  async login(userName: string) {
    const payload = { userName };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async changePassword(
    userName: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.findUser(userName);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }

    const isCorrectPassword = await compare(oldPassword, user.passwordHash);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }

    const salt = await genSalt(10);
    user.passwordHash = await hash(newPassword, salt);
    await user.save();
  }
}
