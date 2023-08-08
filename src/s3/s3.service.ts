import { Delete, Injectable, NotFoundException, Param } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import * as fs from 'fs'
import { promisify } from 'util'
import { InjectModel } from 'nestjs-typegoose'
import { Model, Types } from 'mongoose'
import { Image } from './image.model'
import { Document } from './document.model'
import { Readable } from 'stream'
import { ConfigService } from '@nestjs/config'
import { IEnv } from 'src/configs/env.config'

const unlinkFile = promisify(fs.unlink)

@Injectable()
export class S3Service {
  private readonly s3: S3
  private readonly bucketName: string

  constructor (
    @InjectModel(Image) private readonly imageModel: Model<Image>,
    @InjectModel(Document) private readonly documentModel: Model<Document>,
    private readonly configService: ConfigService<IEnv>,
  ) {
    this.s3 = new S3({
      region: this.configService.get('AWS_BUCKET_REGION'),
      accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
    })
    this.bucketName = this.configService.get('AWS_BUCKET_NAME')
  }

  async uploadFile (
    file: Express.Multer.File,
    description: string,
    category: string,
  ): Promise<string> {
    const fileStream = fs.createReadStream(file.path)
    const key = file.originalname
    const uploadParams = {
      Bucket: this.bucketName,
      Body: fileStream,
      Key: key,
    }

    const result = await this.s3.upload(uploadParams).promise()
    await unlinkFile(file.path)

    const fileRecord = new this.imageModel({
      name: file.originalname,
      description,
      category,
      imageUrl: result.Key,
    })

    await fileRecord.save()

    return result.Key
  }

  async getFileStream (fileKey: string): Promise<Readable> {
    const params = {
      Key: fileKey,
      Bucket: this.bucketName,
    }

    try {
      await this.s3.headObject(params).promise()
      return this.s3.getObject(params).createReadStream()
    } catch (error) {
      throw new NotFoundException('File not found')
    }
  }

  async getImagesByCategory (category: string): Promise<Image[]> {
    return this.imageModel.find({ category }).exec()
  }

  async uploadDocument (
    file: Express.Multer.File,
    description: string,
    category: string,
  ): Promise<string> {
    const fileStream = fs.createReadStream(file.path)
    const key = file.originalname
    const uploadParams = {
      Bucket: this.bucketName,
      Body: fileStream,
      Key: key,
    }

    const result = await this.s3.upload(uploadParams).promise()
    await unlinkFile(file.path)

    const documentRecord = new this.documentModel({
      name: file.originalname,
      description,
      category,
      documentURI: result.Key,
    })

    await documentRecord.save()

    return result.Key
  }

  async getDocumentsByCategory (category: string): Promise<Document[]> {
    return this.documentModel.find({ category }).exec()
  }

  async deleteFile (fileKey: string): Promise<void> {
    // const deleteParams = {
    //   Key: fileKey,
    //   Bucket: process.env.AWS_BUCKET_NAME,
    // };

    // await this.s3.deleteObject(deleteParams).promise();
    await this.imageModel.deleteOne({ imageUrl: fileKey }).exec()
  }

  async deleteDocument (fileKey: string): Promise<void> {
    // const deleteParams = {
    //   Key: fileKey,
    //   Bucket: process.env.AWS_BUCKET_NAME,
    // };

    // await this.s3.deleteObject(deleteParams).promise();
    await this.documentModel.deleteOne({ documentURI: fileKey }).exec()
  }
}
