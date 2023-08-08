import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { getMongoConfig } from './configs/mongo.config'
import { AuthModule } from './auth/auth.module'
import { MainModule } from './mainPage/mainPage.module'
import { S3Module } from './s3/s3.module'
import { DogCardModule } from './dog-card/dog-card.module'
import { envValidationSchea } from './configs/env.config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    AuthModule,
    MainModule,
    S3Module,
    DogCardModule,
  ],
})
export class AppModule {}
