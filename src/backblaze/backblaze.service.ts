import { Inject, Injectable } from '@nestjs/common'
import BackBlazeB2 from 'backblaze-b2'
import { ConfigService } from '@nestjs/config'
import { IEnv } from 'src/configs/env.config'
@Injectable()
export class BackblazeService {
  private bucketId: string
  constructor (
    @Inject('bb2Client') private readonly bb2: BackBlazeB2,
    private readonly configService: ConfigService<IEnv>,
  ) {
    this.bucketId = configService.get('BB2_FILES_BUCKET_ID')
  }
  async uploadFile (type: 'Image' | 'Document', file: Buffer, name: string) {
    try {
      const { data } = await this.bb2.getUploadUrl({
        bucketId: this.bucketId,
      })
      const result = await this.bb2.uploadFile({
        data: file,
        fileName: type + ':' + name,
        uploadUrl: data.uploadUrl,
        uploadAuthToken: data.authorizationToken,
      })
      console.log(result)
      return result.data.fileId
    } catch (error) {
      throw new Error('Something goes wrong')
    }
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
