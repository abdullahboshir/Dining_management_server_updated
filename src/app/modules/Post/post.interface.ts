import { Types } from "mongoose";

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

export type TPost = {
  title: string;
  description: string;
  createdBy: Types.ObjectId;
  images?: string[];
  status?: "published" | "draft" | "hidden";
  likes?: string[];
  comments?: TComment[];
  createdAt?: Date;
  updatedAt?: Date;
}
