import { Admin } from '../Admin/admin.model'
import { Manager } from '../Manager/manager.model'
import Student from '../Student/student.model'
import User from '../User/user.model'
import { TNotice } from './notice.interface'
import { Notice } from './notice.model'

export const createNoticeService = async (payload: TNotice) => {
  const response = await Notice.create(payload)
  return response
}

export const getAllNoticesService = async () => {
  const notices = await Notice.find().sort({ createdAt: -1 })

  const models = [Admin, Student, Manager] as any

  const fullNotices = await Promise.all(
    notices.map(async (notice) => {
      let fullUser = null

      for (const model of models) {
        const result = await model
          .findOne({ id: notice.createdBy })
          .populate('user')
        if (result) {
          fullUser = result
          break
        }
      }

      if (!fullUser) {
        fullUser = await User.findOne({ id: notice.createdBy })
      }

      return {
        ...notice.toObject(),
        createdByInfo: fullUser,
      }
    }),
  )

  console.log('✅ Full Notices with Populated createdBy:', fullNotices)
  return fullNotices
}
