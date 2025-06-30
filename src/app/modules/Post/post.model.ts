import { Schema, model, Types } from 'mongoose'

const ReplySchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }, 
)

const CommentSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    likes: { type: Number, default: 0 },
    replies: [ReplySchema],
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
)

const PostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    creator: { type: Types.ObjectId, ref: 'User', required: true },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ['published', 'draft', 'hidden'],
      default: 'published',
    },
    likes: [{ type: String, default: 0 }],
    comments: [CommentSchema],
  },
  {
    timestamps: true,
  },
)

export const Post = model('Post', PostSchema)
