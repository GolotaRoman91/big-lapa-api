import { prop } from '@typegoose/typegoose';

export class Image {
  @prop({ required: true })
  name: string;

  @prop()
  description?: string;

  @prop({ required: true })
  category: string;

  @prop({ required: true })
  imageUrl: string;
}
