import { Module } from '@nestjs/common';
import { MainController } from './mainPage.controller';
import { MainService } from './mainPage.service';
import { MainModel } from './mainPage.model/mainPage.model';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  controllers: [MainController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: MainModel,
        schemaOptions: {
          collection: 'MainPage',
        },
      },
    ]),
  ],
  providers: [MainService],
})
export class MainModule {}
