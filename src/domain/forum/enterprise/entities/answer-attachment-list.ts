import { WatchedList } from '@/core/entities/watched-list'
import { AnswerAttachment } from './answer-attachment'

export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    const idInstanceA = a.attachmentId
    const idInstanceB = b.attachmentId

    return idInstanceA.equals(idInstanceB)
  }
}
