import { Document, Types } from "mongoose";

// Reply Interface
export interface IReply {
  user: Types.ObjectId;
  parentId?: string;
  text: string;
  likes: number;
  id: string;
  createdAt?: Date;
}

// Comment Interface
export interface IComment {
  user: Types.ObjectId;
  id: string;
  postId: string;
  text: string;
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  replies?: IReply[];
  createdAt?: Date;
}

// Post Interface (extends Mongoose Document)
export interface IPost extends Document {
  title: string;
  description: string;
  createdBy: Types.ObjectId;
  images?: string[];
  status: "published" | "draft" | "hidden";
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  comments?: IComment[];
  bookmarks: Types.ObjectId[];
  isHidden: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}