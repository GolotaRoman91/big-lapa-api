import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { getMongoConfig } from './configs/mongo.config'
import { AuthModule } from './auth/auth.module'
import { MainModule } from './mainPage/mainPage.module'
import { S3Module } from './s3/s3.module'
import { DogCardModule } from './dog-card/dog-card.module'
import { BackblazeModule } from './backblaze/backblaze.module'
import { envValidationSchea } from './configs/env.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchea,
    }),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    AuthModule,
    MainModule,
    S3Module,
    BackblazeModule,
    DogCardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
