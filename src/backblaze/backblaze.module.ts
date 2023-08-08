import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { BackBlazeController } from './backblaze.controller'
import { backBlazeFactory } from './backblaze.instance.provider'
import { BackblazeService } from './backblaze.service'

@Module({
  controllers: [BackBlazeController],
  imports: [MulterModule.register({ storage: memoryStorage() })],
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
