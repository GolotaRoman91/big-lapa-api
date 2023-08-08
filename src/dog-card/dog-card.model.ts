import { prop } from '@typegoose/typegoose'

export class DogCard {
  @prop({ required: true })
  mainPhoto: string

  @prop({ required: true, type: () => [String] })
  photos: string[]

  @prop({ required: true })
  name: string

  @prop({ required: true })
  sex: string

  @prop({ required: true })
  age: string

  @prop({ required: true })
  haschip: boolean

  @prop({ required: true })
  hasbreed: boolean

  @prop()
  breed?: string

  @prop({ required: true })
  size: string
}
