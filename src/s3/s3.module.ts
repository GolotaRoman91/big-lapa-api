import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { Image } from './image.model';
import { Document } from './document.model';

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
      {
        typegooseClass: Document,
        schemaOptions: {
          collection: 'Documents',
        },
      },
    ]),
  ],
  controllers: [S3Controller],
  providers: [S3Service],
})
export class S3Module {}
