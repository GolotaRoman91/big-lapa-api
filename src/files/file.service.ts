import { Injectable } from '@nestjs/common'
import { BackblazeService } from '../backblaze/backblaze.service'

@Injectable()
export class FileService {
  constructor (private readonly backblazeService: BackblazeService) {}
}
