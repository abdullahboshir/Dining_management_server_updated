/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendImageToCloudinary } from '../../utils/IMGUploader'
import { Post } from './post.model'
import { Types } from 'mongoose'
import { IComment, IPost } from './post.interface'
import { generateCommentId } from './post.utils'

export const createPostService = async (
  postData: IPost,
  files: any,
  user: any,
) => {
  postData.id = generateCommentId()
  const imgRandomName = Date.now().toString() + Math.floor(Math.random() * 1000)
  const images = []

  if (files.length > 0) {
    for (const file of files) {
      const imgName = `${file?.originalname}-${imgRandomName}`
      const imgPath = file?.path
      const { secure_url } = (await sendImageToCloudinary(
        imgName,
        imgPath,
      )) as any
      images.push(secure_url)
    }

    postData.images = images
  }

  postData.createdBy = user?.userId
  const result = await Post.create(postData)

  return result
}

export const getAllPostsService = async () => {
  const posts = await Post.find({})
    .populate('createdBy')
    .populate('comments.user')
  return posts
}

export const updateLikeService = async (postId: string, userId: string) => {
  const isAlreadyLiked = await Post.findOne({ _id: postId, likes: userId })
  const checked = isAlreadyLiked
    ? { $pull: { likes: userId } }
    : { $addToSet: { likes: userId } }
  const posts = await Post.findByIdAndUpdate(postId, checked, { new: true })
  return posts
}

export const updateCommentReactionsServices = async (
  postId: string,
  userId: Types.ObjectId,
  payload: { commentId: string; action: 'like' | 'dislike' },
) => {
  const post = await Post.findOne({
    _id: postId,
    'comments.id': payload.commentId,
  })
  const isAlreadyLiked = post?.comments.find((comment) =>
    comment?.likes?.includes(userId),
  )
  const isAlreadyDisliked = post?.comments.find((comment) =>
    comment?.dislikes?.includes(userId),
  )
  
  const updateOperation =
  payload.action === 'like'
      ? isAlreadyLiked
        ? {
            $pull: { 'comments.$[elem].likes': userId },
          }
        : {
          $addToSet: { 'comments.$[elem].likes': userId },
          $pull: { 'comments.$[elem].dislikes': userId }
          }
          : isAlreadyDisliked ? {
          $pull: { 'comments.$[elem].dislikes': userId },
        } : {
          $addToSet: { 'comments.$[elem].dislikes': userId }, 
          $pull: { 'comments.$[elem].likes': userId }
        }
 
        
        const updatedPost = await Post.findOneAndUpdate(
          { _id: postId },
          updateOperation,
          {
            new: true,
            arrayFilters: [{ 'elem.id': payload.commentId }],
          },
        )

  if (!updatedPost) {
    throw new Error('Post or comments not found')
  }

  return updatedPost
}

export const updateBookmarkService = async (_id: string, user: any) => {

  const isAlreadyBookmark = await Post.findOne({
    _id,
    bookmarks: { $in: [user.userId] } 
  })

  const finalResult = await Post.findByIdAndUpdate(
    _id,
    isAlreadyBookmark
      ? { $pull: { bookmarks: user?.userId } }
      : { $push: { bookmarks: user?.userId } },
  )
  return finalResult
}

export const createCommentService = async (
  _id: Types.ObjectId,
  payload: IComment,
  user: any,
) => {
  payload.user = user?.userId
  const result = await Post.findOneAndUpdate(
    { _id },
    { $push: { comments: payload } },
    { new: true },
  )
  return result
}
