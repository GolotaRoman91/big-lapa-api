import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Путь к временной директории для загрузки файлов
    }),
  ],
  controllers: [S3Controller],
  providers: [S3Service],
})
export class S3Module {}
