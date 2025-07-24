/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import AppError from '../../errors/AppError';
import { sendImageToCloudinary } from '../../utils/IMGUploader'
import User from '../User/user.model';
import { TPost } from './post.interface'
import { Post } from './post.model'
import { findRoleBaseUser } from '../Auth/auth.utils';

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

  postData.createdBy = user?.userId
  const result = await Post.create(postData)

  return result
}


export const getAllPostsService = async () => {
    const posts = await Post.find({}).populate('createdBy')
    return posts;
}


export const updateLikeService = async (postId: string, userId: string) => {

    const isAlreadyLiked = await Post.findOne({_id: postId, likes: userId})
    console.log('is lsssssssssssssss', isAlreadyLiked)

    const checked = isAlreadyLiked? {$pull: {likes: userId}} : {$addToSet: {likes: userId}}

    const posts = await Post.findByIdAndUpdate(postId, checked, { new: true })
    return posts;
}



export const updateBookmarkService = async (
  _id: string,
  user: any
) => {
console.log('is gootedddddddddd', _id, user)
  const isUserExists = await User.findOne({_id: user?.userId});

  if(!isUserExists){
    throw new AppError(status.NOT_FOUND, 'The user not found')
  }
  
  
  const  result = await findRoleBaseUser(isUserExists?.id, isUserExists?.email, isUserExists?.role);


  

  const isAlreadyBookmark  = await Post.findOne({_id, bookmark: {$in: [result?._id]}});

  const finalResult = await Post.findByIdAndUpdate(_id, 
    isAlreadyBookmark ? {$pull: { bookmark: result?._id }} : {$addToSet: { bookmark: result?._id }, 
  })
  return finalResult
}
