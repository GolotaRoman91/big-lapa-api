import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as fs from 'fs';
import { promisify } from 'util';
import { InjectModel } from 'nestjs-typegoose';
import { Model } from 'mongoose';
import { Image } from './image.model';

const unlinkFile = promisify(fs.unlink);

@Injectable()
export class S3Service {
  private readonly s3: S3;

  constructor(@InjectModel(Image) private readonly imageModel: Model<Image>) {
    this.s3 = new S3({
      region: process.env.AWS_BUCKET_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    description: string,
    category: string,
  ): Promise<string> {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Body: fileStream,
      Key: file.filename,
    };

    const result = await this.s3.upload(uploadParams).promise();
    await unlinkFile(file.path);

    // Сохранение информации о файле в базе данных
    const fileRecord = new this.imageModel({
      name: file.originalname,
      description,
      category,
      imagePath: `/images/${result.Key}`,
    });

    await fileRecord.save();

    return result.Key;
  }

  getFileStream(fileKey: string): any {
    const downloadParams = {
      Key: fileKey,
      Bucket: process.env.AWS_BUCKET_NAME,
    };

    return this.s3.getObject(downloadParams).createReadStream();
  }
}
