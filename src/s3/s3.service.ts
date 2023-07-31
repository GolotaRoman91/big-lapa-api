import { Delete, Injectable, NotFoundException, Param } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as fs from 'fs';
import { promisify } from 'util';
import { InjectModel } from 'nestjs-typegoose';
import { Model, Types } from 'mongoose';
import { Image } from './image.model';
import { Document } from './document.model';

const unlinkFile = promisify(fs.unlink);

@Injectable()
export class S3Service {
  private readonly s3: S3;

  constructor(
    @InjectModel(Image) private readonly imageModel: Model<Image>,
    @InjectModel(Document) private readonly documentModel: Model<Document>,
  ) {
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

    const fileRecord = new this.imageModel({
      name: file.originalname,
      description,
      category,
      imageUrl: result.Key,
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

  async getImagesByCategory(category: string): Promise<Image[]> {
    return this.imageModel.find({ category }).exec();
  }

  async uploadDocument(
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

    const documentRecord = new this.documentModel({
      name: file.originalname,
      description,
      category,
      documentURI: result.Key,
    });

    await documentRecord.save();

    return result.Key;
  }

  async getDocumentsByCategory(category: string): Promise<Document[]> {
    return this.documentModel.find({ category }).exec();
  }

  async deleteFile(fileKey: string): Promise<void> {
    // const deleteParams = {
    //   Key: fileKey,
    //   Bucket: process.env.AWS_BUCKET_NAME,
    // };

    // await this.s3.deleteObject(deleteParams).promise();
    await this.imageModel.deleteOne({ imageUrl: fileKey }).exec();
  }

  async deleteDocument(fileKey: string): Promise<void> {
    // const deleteParams = {
    //   Key: fileKey,
    //   Bucket: process.env.AWS_BUCKET_NAME,
    // };

    // await this.s3.deleteObject(deleteParams).promise();
    await this.documentModel.deleteOne({ documentURI: fileKey }).exec();
  }
}
