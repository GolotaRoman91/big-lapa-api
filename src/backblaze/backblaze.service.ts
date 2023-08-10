import { Inject, Injectable } from '@nestjs/common'
import BackBlazeB2 from 'backblaze-b2'
import { ConfigService } from '@nestjs/config'
import { IEnv } from 'src/configs/env.config'
import { InjectModel } from 'nestjs-typegoose'
import { Model } from 'mongoose'
import { FileModel } from './models/file.model'
@Injectable()
export class BackblazeService {
  private readonly bucketId: string
  constructor (
    @Inject('bb2Client') private readonly bb2: BackBlazeB2,
    @InjectModel(FileModel) private readonly fileModel: Model<FileModel>,
    private readonly configService: ConfigService<IEnv>,
  ) {
    this.bucketId = configService.get('BB2_FILES_BUCKET_ID')
  }
  async uploadFile (file: Buffer, name: string, type: string = '') {
    try {
      const { data } = await this.bb2.getUploadUrl({
        bucketId: this.bucketId,
      })
      const result = await this.bb2.uploadFile({
        data: file,
        fileName: name,
        uploadUrl: data.uploadUrl,
        uploadAuthToken: data.authorizationToken,
      })
      const url = result.data.fileId
      const newFile: FileModel = { Url: url }
      if (type) newFile.category = type
      if (name) newFile.name = name
      await this.fileModel.create(newFile)
      return url
    } catch (error) {
      console.error(error)
      throw new Error('Something goes wrong')
    }
  }

  async getFileInfo (url: string) {
    console.log(url, 'url')
    const res = await this.fileModel.findOne({ Url: url })
    return res
  }

  async getFile (id: string) {
    try {
      const res = await this.bb2.downloadFileById({
        fileId: id,
        responseType: 'stream',
      })
      return res.data
    } catch (error) {
      throw new Error('Something goes wrong')
    }
  }
}
