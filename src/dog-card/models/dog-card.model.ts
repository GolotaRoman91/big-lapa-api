import { prop, Ref } from '@typegoose/typegoose';
import { DogPhotoType } from './dog-photo-type.model';

export class DogCard {
  @prop({ required: true })
  mainPhoto: string;

  @prop({ required: true, type: () => DogPhotoType })
  photos: Ref<DogPhotoType>[];

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  sex: string;

  @prop({ required: true })
  age: string;

  @prop({ required: true })
  haschip: boolean;

  @prop({ required: true })
  hasbreed: boolean;

  @prop()
  description?: string;

  @prop()
  breed?: string;

  @prop({ required: true })
  size: string;
}
