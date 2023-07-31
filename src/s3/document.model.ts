import { prop } from '@typegoose/typegoose';

export class Document {
  @prop({ required: true })
  name: string;

  @prop()
  description?: string;

  @prop({ required: true })
  category: string;

  @prop()
  documentURI?: string;
}
