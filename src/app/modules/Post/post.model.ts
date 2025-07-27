import { Schema, model, Types } from 'mongoose'
import { generateCommentId } from './post.utils'

const ReplySchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    parentId: String,
    text: { type: String, required: true },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    id: {
      type: String,
      default: generateCommentId,
    },
  },
  { _id: false },
)

const CommentSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    id: {
      type: String,
      default: generateCommentId,
    },
    postId: { type: String, required: true },
    text: { type: String, required: true },
    likes: [{ type: Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: Types.ObjectId, ref: 'User' }],
    replies: [ReplySchema],
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
)

const PostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ['published', 'draft', 'hidden'],
      default: 'published',
    },
    likes: [{ type: Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: Types.ObjectId, ref: 'User' }],
    comments: [CommentSchema],
    bookmarks: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

export const Post = model('Post', PostSchema)
