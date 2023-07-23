import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { Image } from './image.model';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    TypegooseModule.forFeature([
      {
        typegooseClass: Image,
        schemaOptions: {
          collection: 'Images',
        },
      },
    ]),
  ],
  controllers: [S3Controller],
  providers: [S3Service],
})
export class S3Module {}