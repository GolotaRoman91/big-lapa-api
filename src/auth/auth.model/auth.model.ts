import { ApiProperty } from '@nestjs/swagger'
import { prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

export interface UserModel extends Base {}
export class UserModel extends TimeStamps {
  @ApiProperty()
  @prop({ unique: true })
  userName: string

  @ApiProperty()
  @prop()
  passwordHash: string
}
