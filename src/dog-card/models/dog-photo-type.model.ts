import { prop } from '@typegoose/typegoose';

export class DogPhotoType {
  @prop({ required: true })
  id: string;

  @prop({ required: true })
  src: string | File;

  @prop()
  encodedBase64?: string;
}
