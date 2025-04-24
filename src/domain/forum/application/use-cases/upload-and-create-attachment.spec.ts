import { expect, describe, it, beforeEach } from 'vitest'
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment'

import { FakeUploader } from '@/test/storage/fake-uploader'
import { InMemoryAttachmentsRepository } from '@/test/repositories/in-memory-attachments-repository'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'

describe('UploadAndCreateAttachment unit tests', () => {
  let uploadAndCreateAttachmentUseCase: UploadAndCreateAttachmentUseCase
  let fakeUploader: FakeUploader
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository

  beforeEach(() => {
    fakeUploader = new FakeUploader()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    uploadAndCreateAttachmentUseCase = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    )
  })

  it('should be able to create an attachment', async () => {
    const payload = {
      fileName: 'Test filename',
      fileType: 'image/webp',
      body: Buffer.from('hello'),
    }

    const result = await uploadAndCreateAttachmentUseCase.execute(payload)

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.attachments[0],
    })
  })

  it('should return left if filetype is not in the list of allowed file types', async () => {
    const payload = {
      fileName: 'Test filename',
      fileType: 'mp4',
      body: Buffer.from('hello'),
    }

    const result = await uploadAndCreateAttachmentUseCase.execute(payload)

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(new InvalidAttachmentTypeError('mp4'))
  })
})
