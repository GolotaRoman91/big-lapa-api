import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFiles,
} from '@nestjs/common'
import { ParseFilesPipe } from '../pipes/parse-files.pipe'

export const ValidateUploadFiels = (
  maxSize: number,
  fileType: string | RegExp,
) =>
  UploadedFiles(
    new ParseFilesPipe(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({ maxSize }),
          new FileTypeValidator({
            fileType,
          }),
        ],
      }),
    ),
  )
