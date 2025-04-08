import { model, Schema } from 'mongoose'
import { TNotice } from './notice.interface'

const noticeSchema = new Schema<TNotice>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      required: [true, 'ID is required'],
      ref: 'User',
    },
    hall: {
      type: Schema.Types.ObjectId,
      ref: 'Hall',
      required: [true, 'Hall ID is required'],
    },
    dining: {
      type: Schema.Types.ObjectId,
      ref: 'Dining',
      required: [true, 'Dining ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Notice heading is required'],
      trim: true,
      maxlength: [100, 'Notice heading cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Notice description is required'],
      trim: true,
    },

    schedule: {
      type: Date,
      required: [true, 'Notice schedule is required'],
    },
    type: {
      type: String,
      enum: ['General', 'Urgent', 'Event', 'Update'],
      required: [true, 'Notice type is required'],
      default: 'General',
    },
    audience: {
      type: String,
      enum: ['Student', 'Manager', 'Admin', 'Moderator', 'All'],
      required: [true, 'At least one audience type is required'],
      default: 'All',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Archived', 'Pending'],
      required: [true, 'Status is required'],
      default: 'Inactive',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    tags: {
      type: [String],
      default: [],
    },
    expiryDate: {
      type: Date,
      required: false,
    },
    attachments: {
      type: [String],
      default: [],
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    relatedNotices: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Notice',
        default: [],
      },
    ],
    location: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
)

// Filter out deleted notices
noticeSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

noticeSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

noticeSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })
  next()
})

export const Notice = model<TNotice>('Notice', noticeSchema)
