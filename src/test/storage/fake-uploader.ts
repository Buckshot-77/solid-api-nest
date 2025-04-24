import {
  Uploader,
  UploadParams,
} from '@/domain/forum/application/storage/uploader'

export class FakeUploader implements Uploader {
  async upload(params: UploadParams): Promise<{ url: string }> {
    const { fileName } = params
    return { url: `url-${fileName}` }
  }
}
