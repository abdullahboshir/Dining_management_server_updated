import { Schema, model, Types } from 'mongoose'
import { FilterByEnum, TNotice } from './notice.interface'

const noticeSchema = new Schema<TNotice>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hall: {
      type: Schema.Types.ObjectId,
      ref: 'Hall',
      required: true,
    },
    dining: {
      type: Schema.Types.ObjectId,
      ref: 'Dining',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    noticeType: {
      type: String,
      enum: [
        'General',
        'Urgent',
        'Event',
        'Update',
        'Info',
        'Warning',
        'Survey',
        'Maintenance',
        'System',
        'Reminder',
        'Policy',
      ],
      default: 'General',
    },
    audience: {
      isAll: { type: Boolean, default: false }, // Changed to boolean
      role: {
        type: String,
        enum: ['admin', 'manager', 'user', 'moderator'],
      },
      specificUsers: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      filtered: {
        filterBy: {
          type: String,
          enum: Object.values(FilterByEnum),
        },
        filter: {
          type: Schema.Types.Mixed,
          default: {},
        },
      },
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Archived'],
      default: 'Inactive',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    publishedStatus: {
      type: String,
      enum: ['Pending', 'Published'],
      default: 'Pending',
    },
    scheduled: {
      scheduleAt: { type: Date },
      expiryDate: { type: Date },
      type: {
        isInstant: { type: Boolean, default: false },
        perSession: [{ type: Types.ObjectId, ref: 'Session' }],
        yearly: {
          date: { type: String },
          time: { type: String },
        },
        monthly: {
          date: { type: String },
          time: { type: String },
        },
        weekly: {
          days: [
            {
              type: String,
              enum: [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
              ],
            },
          ],
          time: { type: String },
        },
        daily: {
          time: { type: String },
        },
        hourly: {
          minute: { type: Number },
        },
        recurring: {
          interval: { type: Number },
          unit: {
            type: String,
            enum: ['minutes', 'hours', 'days', 'weeks', 'months', 'years'],
          },
        },
        limited: {
          count: { type: Number },
        },
        event: { type: String },
      },
    },
    actions: {
      label: { type: String, required: true },
      url: { type: String, required: true },
      type: { type: String, enum: ['external', 'internal'], required: true },
    },
    eventTrigger: {
      type: {
        type: String,
        enum: ['Scheduled', 'Manual', 'SystemEvent', 'UserAction'],
      },
      triggeredBy: {
        type: String,
        enum: ['Login', 'Signup', 'PasswordReset', 'ProfileUpdate'],
      },
      condition: String,
      triggeredAt: Date,
    },
    log: [
      {
        updatedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        updatedAt: Date,
        action: {
          type: String,
          enum: [
            'Created',
            'Updated',
            'Published',
            'Archived',
            'Deleted',
            'Viewed',
          ],
        },
        notes: String,
      },
    ],
    isPinned: {
      type: [String],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    dismissible: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    deliveryChannels: {
      type: [String],
      enum: ['Email', 'SMS', 'InApp'],
      default: ['InApp'],
    },
    attachments: {
      type: [String],
      default: [],
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
)

// Soft-delete filtering
noticeSchema.pre('find', function (next) {
  this.where({ isDeleted: { $ne: true } })
  next()
})

noticeSchema.pre('findOne', function (next) {
  this.where({ isDeleted: { $ne: true } })
  next()
})

noticeSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })
  next()
})

export const Notice = model<TNotice>('Notice', noticeSchema)
