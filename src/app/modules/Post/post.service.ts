/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendImageToCloudinary } from '../../utils/IMGUploader'
import { TPost } from './post.interface'
import { Post } from './post.model'

export const createPostService = async (
  postData: TPost,
  files: any,
  user: any,
) => {

const imgRandomName = Date.now().toString() + Math.floor(Math.random() * 1000);
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

  postData.creator = user?.userId
  const result = await Post.create(postData)

  return result
}


export const getAllPostsService = async () => {
    const posts = await Post.find({})
    return posts;
}


export const updateLikeService = async (postId: string, userId: string) => {

    const isAlreadyLiked = await Post.findOne({_id: postId, likes: userId})
    console.log('is lsssssssssssssss', isAlreadyLiked)

    const checked = isAlreadyLiked? {$pull: {likes: userId}} : {$addToSet: {likes: userId}}

    const posts = await Post.findByIdAndUpdate(postId, checked, { new: true })
    return posts;
}
