import { Types } from 'mongoose'

export interface TNotice {
  createdBy: Types.ObjectId
  hall?: Types.ObjectId
  dining?: Types.ObjectId
  title: string
  description: string
  schedule: Date
  type: 'General' | 'Urgent' | 'Event' | 'Update'
  audience: 'Student' | 'Manager' | 'Admin' | 'Moderator' | 'All'
  status: 'Active' | 'Inactive' | 'Archived' | 'Pending'
  priority: 'Low' | 'Medium' | 'High'
  actions: {
    label: string
    url: string
    type: 'external' | 'internal'
  }
  eventTrigger?: {
    type: 'Scheduled' | 'Manual' | 'SystemEvent' | 'UserAction'
    triggeredBy?: 'Login' | 'Signup' | 'PasswordReset' | 'ProfileUpdate'
    condition?: string
    triggeredAt?: Date
  }

  log?: {
    updatedAt: Date
    updatedBy: Types.ObjectId
    action:
      | 'Created'
      | 'Updated'
      | 'Published'
      | 'Archived'
      | 'Deleted'
      | 'Viewed'
    notes?: string
  }[]
  sentTo?:
    | 'All'
    | 'SpecificUsers'
    | 'FilteredGroup'
    | 'ByRole'
    | 'ByLocation'
    | 'ByHall'
    | 'ByDining'
    | 'ByTag'
    | 'CustomQuery'

  isPublished: boolean
  isPinned?: boolean
  isDeleted: boolean
  dismissible: boolean
  tags: string[]
  targetUserIds?: Types.ObjectId[]
  readBy?: Types.ObjectId[]
  deliveryChannels?: ('Email' | 'SMS' | 'InApp')[]
  expiryDate?: Date
  attachments?: string[]
  updatedBy?: Types.ObjectId
  viewCount: number
  relatedNotices: Types.ObjectId[]
  location?: string
}
