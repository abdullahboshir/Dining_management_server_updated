/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId, Types } from 'mongoose'

export enum FilterByEnum {
  Hall = 'Hall',
  Dining = 'Dining',
  Tag = 'Tag',
  CustomQuery = 'CustomQuery',
}

export type TReply = {
  user: Types.ObjectId;
  text: string;
  likes?: number;
  createdAt?: Date;
}

export type TComment = {
  user: Types.ObjectId;
  text: string;
   likes?: string[];
  replies?: TReply[];
  createdAt?: Date;
}

export interface TNotice {
  createdBy: ObjectId
  hall: ObjectId
  dining: ObjectId
  title: string
  description: string
  noticeType:
    | 'General'
    | 'Urgent'
    | 'Event'
    | 'Update'
    | 'Info'
    | 'Warning'
    | 'Survey'
    | 'Maintenance'
    | 'System'
    | 'Reminder'
    | 'Policy'
  audience: 'admin' | 'manager' | 'user' | 'moderator' | 'student' | 'all'
    // specificUsers?: ObjectId[]
    // filtered?: {
    //   filterBy: FilterByEnum
    //   filter: Record<string, any>
    // }
  
  status: 'Active' | 'Inactive' | 'Archived'
  priority: 'Low' | 'Medium' | 'High'
  publishedStatus: 'Pending' | 'Published'
    likes?: string[];
    comments?: TComment[];
  scheduleAt?: Date
    expiryDate?: Date
  // scheduled: {
  //   scheduleAt?: Date
  //   expiryDate?: Date
  //   type: {
  //     isInstant: boolean
  //     perSession?: ObjectId[]
  //     yearly?: { date: string; time: string }
  //     monthly?: { date: string; time: string }
  //     weekly?: { days: string[]; time: string }
  //     daily?: { time: string }
  //     hourly?: { minute: number }
  //     recurring?: {
  //       interval: number
  //       unit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years'
  //     }
  //     limited?: { count: number }
  //     event?: string
  //   }
  // }
  actions?: {
    label: string
    url: string
    type: 'external' | 'internal'
  }
  eventTrigger?: {
    type: 'Scheduled' | 'Manual' | 'SystemEvent' | 'UserAction'
    triggeredBy: 'Login' | 'Signup' | 'PasswordReset' | 'ProfileUpdate'
    condition?: string
    triggeredAt?: Date
  }
  log?: {
    updatedBy: ObjectId
    updatedAt: Date
    action:
      | 'Created'
      | 'Updated'
      | 'Published'
      | 'Archived'
      | 'Deleted'
      | 'Viewed'
    notes?: string
  }[]
  isPinned: string[]
  isDeleted: boolean
  dismissible: boolean
  tags: string[]
  readBy: ObjectId[]
  deliveryChannels: ('Email' | 'SMS' | 'InApp')[]
  attachments: string[]
  lastUpdatedBy?: ObjectId
  viewCount: number
  relatedNotices: ObjectId[]
}
