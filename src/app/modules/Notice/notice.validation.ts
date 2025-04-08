import { z } from 'zod'
import mongoose from 'mongoose'

export const NoticeValidationSchema = z.object({
  createdBy: z.instanceof(mongoose.Types.ObjectId, {
    message: 'Invalid createdBy ID',
  }),
  hall: z.optional(
    z.instanceof(mongoose.Types.ObjectId, { message: 'Invalid hall ID' }),
  ),
  dining: z.optional(
    z.instanceof(mongoose.Types.ObjectId, { message: 'Invalid dining ID' }),
  ),
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  time: z.date({ message: 'Invalid date format for time' }),
  schedule: z.date({ message: 'Invalid date format for schedule' }),
  type: z.enum(['General', 'Urgent', 'Event', 'Update'], {
    message: 'Invalid notice type',
  }),
  audience: z.enum(['Student', 'Manager', 'Admin', 'Moderator', 'All'], {
    message: 'Invalid audience type',
  }),
  status: z.enum(['Active', 'Inactive', 'Archived', 'Pending'], {
    message: 'Invalid status type',
  }),
  isPublished: z.boolean(),
  isDeleted: z.boolean().default(false),
  priority: z.enum(['Low', 'Medium', 'High'], {
    message: 'Invalid priority level',
  }),
  tags: z.array(z.string()).default([]),
  expiryDate: z.optional(
    z.date({ message: 'Invalid date format for expiryDate' }),
  ),
  attachments: z.array(z.string()).default([]),
  updatedBy: z.optional(
    z.instanceof(mongoose.Types.ObjectId, { message: 'Invalid updatedBy ID' }),
  ),
  viewCount: z.number().int().nonnegative().default(0),
  relatedNotices: z.array(z.instanceof(mongoose.Types.ObjectId)).default([]),
  location: z.optional(
    z.string().max(255, 'Location cannot exceed 255 characters'),
  ),
})

export type TNoticeValidation = z.infer<typeof NoticeValidationSchema>
