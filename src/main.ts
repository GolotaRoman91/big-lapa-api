import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { IEnv } from './configs/env.config'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService<IEnv>)
  const PORT = configService.get('PORT')
  app.setGlobalPrefix('api')
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  const config = new DocumentBuilder()
    .setTitle('Big lapa')
    .setDescription('Big apa api documentation')
    .setVersion('0.0.1')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)
  await app.listen(PORT)
}
bootstrap()
