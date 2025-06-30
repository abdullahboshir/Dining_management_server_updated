/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status'
import { findRoleBaseUser } from '../Auth/auth.utils'
import User from '../User/user.model'
import { TNotice } from './notice.interface'
import { Notice } from './notice.model'
import AppError from '../../errors/AppError'
import { sendImageToCloudinary } from '../../utils/IMGUploader'

export const createNoticeService = async (payload: TNotice, files: any) => {

  
  const imgRandomName = Date.now().toString() + '-' + Math.floor(Math.random() * 100000);
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
      
      payload.attachments = images
    }
    
    console.log('payload11111111111111111111111111', payload)
  const response = await Notice.create(payload)
  return response
}

export const getAllNoticesService = async (user: any, query: any) => {

  const isAll = query?.isAllNotication === 'true';
  const isPinned = query?.isPinned === 'true';
  
  const isUserExists = await User.findOne({_id: user?.userId})
  
  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, 'User is not found')
  }
  
  const  roleBaseUser = await findRoleBaseUser(isUserExists?.id, isUserExists?.email, isUserExists?.role);
  
  if (!roleBaseUser) {
    throw new AppError(status.NOT_FOUND, 'The user not found!')
  }

  
  const filter: any = {};
  
  if(isPinned){
    filter.isPinned = {$in: [roleBaseUser?._id]}
  }else if(!isAll){
    filter.createdBy = user?.userId
    console.log('roleBaseUser?._id', filter)
  }
  

  const result = await Notice.find(filter) 
  .sort({ createdAt: -1 })
  .populate('createdBy')
  
  return result
}


export const updatePinnedService = async (
  _id: string,
  user: any
) => {

  const isUserExists = await User.findOne({_id: user?.userId});

  if(!isUserExists){
    throw new AppError(status.NOT_FOUND, 'The user not found')
  }
  
  
  const  result = await findRoleBaseUser(isUserExists?.id, isUserExists?.email, isUserExists?.role);


  

  const isAlreadyPinned  = await Notice.findOne({_id, isPinned: {$in: [result?._id]}});

  const finalResult = await Notice.findByIdAndUpdate(_id, 
    isAlreadyPinned ? {$pull: { isPinned: result?._id }} : {$addToSet: { isPinned: result?._id }, 
    // i can use push but i do not use, because if i use addToSet then avoid duplicate item
  })
  return finalResult
}
