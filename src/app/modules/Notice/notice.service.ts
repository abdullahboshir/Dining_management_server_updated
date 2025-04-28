import { TNotice } from './notice.interface'
import { Notice } from './notice.model'

export const createNoticeService = async (payload: TNotice) => {
  const response = await Notice.create(payload)
  return response
}

export const getAllNoticesService = async () => {
  const notices = await Notice.find()
    .sort({ createdAt: -1 })
    .populate('createdBy')

  return notices
}

export const updatePinnedService = async (
  _id: Object,
  payload: { isPinned: string },
) => {
  const result = await Notice.findByIdAndUpdate(_id, {
    $set: { isPinned: payload.isPinned },
  })
  return result
}
