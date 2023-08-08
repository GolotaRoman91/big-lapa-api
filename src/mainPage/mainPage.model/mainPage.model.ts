import { ApiProperty } from '@nestjs/swagger'
import { prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

export interface MainModel extends Base {}
export class MainModel extends TimeStamps {
  @ApiProperty()
  @prop()
  first_phoneNumber: string

  @ApiProperty()
  @prop()
  second_phoneNumber: string

  @ApiProperty()
  @prop()
  email: string
}
