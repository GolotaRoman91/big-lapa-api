import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './auth.model/auth.model';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: Model<UserModel>,
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
}
