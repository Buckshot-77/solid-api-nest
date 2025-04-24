import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/types/either'

import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Attachment } from '../../enterprise/entities/attachment'
import { Uploader } from '../storage/uploader'

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment
  }
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private readonly attachmentsRepository: AttachmentsRepository,
    private readonly uploader: Uploader,
  ) {}
  async execute({
    body,
    fileName,
    fileType,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    if (!/^(image\/(jpeg|jpg|png|webp)|application\/pdf)$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }
    const { url } = await this.uploader.upload({ body, fileName, fileType })

    const attachment = Attachment.create({
      title: fileName,
      url,
    })
    await this.attachmentsRepository.create(attachment)

    return right({ attachment })
  }
}
