import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { TypegooseModule } from 'nestjs-typegoose'
import { FilesModule } from 'src/files/files.module'
import { BackBlazeController } from './backblaze.controller'
import { backBlazeFactory } from './backblaze.instance.provider'
import { BackblazeService } from './backblaze.service'
import { FileModel } from './models/file.model'

@Module({
  controllers: [BackBlazeController],
  imports: [
    FilesModule,
    MulterModule.register({ storage: memoryStorage() }),
    TypegooseModule.forFeature([FileModel]),
  ],
  providers: [
    {
      provide: 'bb2Client',
      useFactory: backBlazeFactory,
      inject: [ConfigService],
    },
    BackblazeService,
  ],
  exports: [BackblazeService],
})
export class BackblazeModule {}
