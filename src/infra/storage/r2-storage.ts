import {
  Uploader,
  UploadParams,
} from '@/domain/forum/application/storage/uploader'

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'node:crypto'
import { EnvService } from '../config/env.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client
  constructor(private envService: EnvService) {
    const accountId = this.envService.get('CLOUDFLARE_ACCOUNT_ID')
    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: this.envService.get('CLOUD_ACCESS_KEY_ID'),
        secretAccessKey: this.envService.get('CLOUD_SECRET_ACCESS_KEY'),
      },
    })
  }
  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uuid = randomUUID()

    const newFileName = `${uuid}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('CLOUD_BUCKET_NAME'),
        Key: newFileName,
        Body: body,
        ContentType: fileType,
      }),
    )

    return { url: newFileName }
  }
}
