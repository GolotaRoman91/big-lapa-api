import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';

export interface MainModel extends Base {}
export class MainModel extends TimeStamps {
  @prop()
  first_phoneNumber: string;

  @prop()
  second_phoneNumber: string;

  @prop()
  email: string;
}
