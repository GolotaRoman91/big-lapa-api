import { Injectable, OnModuleInit } from '@nestjs/common'
import { BackblazeService } from '../backblaze/backblaze.service'
import fsp from 'fs/promises'
import path from 'path'
import webp from 'webp-converter'

// @Injectable()
export class FileService implements OnModuleInit {
  private dirPath: string
  constructor (private readonly backblazeService: BackblazeService) {
    this.dirPath = path.join(__dirname, '..', 'temp')
  }

  async onModuleInit () {
    // await fsp.rmdir(this.dirPath, { recursive: true })
    // await fsp.mkdir(this.dirPath, { recursive: true })
  }

  private async uploadFile (path: string, file: Buffer) {
    await fsp.writeFile(path, file)
  }

  async uploadToBackBlaze (path, name, type) {
    // this.backblazeService.uploadFile()
  }

  private async getFile (path) {
    const filePath = this.getPath(path)
    return await fsp.readFile(filePath)
  }

  async convertToWebP (file: Buffer, name: string) {
    const filePath = this.getPath(name)
    await this.uploadFile(filePath, file)
    const webpPath = this.getWebpPath(filePath)
    await webp.cwebp(filePath, webpPath, '-q 80')
    await this.deleteFile(filePath)
    return webpPath
  }

  private async deleteFile (path) {
    await fsp.unlink(path)
  }
  private getWebpPath (path: string) {
    const splitedPath = path.split('.')
    splitedPath.splice(-1, 1, 'webp')
    return splitedPath.join('.')
  }

  private getPath (name: string) {
    return path.join(this.dirPath, name)
  }
}
