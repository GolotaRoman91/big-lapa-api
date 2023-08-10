import { prop } from '@typegoose/typegoose'

export class FileModel {
  @prop({ required: false })
  category?: string

  @prop({ required: false })
  name?: string

  @prop({ required: true, unique: true })
  Url: string
}
