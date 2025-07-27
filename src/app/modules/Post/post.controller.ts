import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendRespnse"
import httpStatus from 'http-status'
import { createCommentService, createPostService, getAllPostsService, updateBookmarkService, updateCommentReactionsServices, updateLikeService } from "./post.service"
import { Types } from "mongoose"

export const createPostController = catchAsync(async (req, res) => {
  const { postData } = req.body
  const files = req?.files;
  const data = await createPostService(postData, files, req?.user)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post has been created successfully',
    data,
  })
})


export const getAllPostsController = catchAsync(async (req, res) => {
  
  const data = await getAllPostsService()

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post has been retrieved successfully',
    data,
  })
})

export const updateLikeController = catchAsync(async (req, res) => {
    const { postId } = req.params
  const data = await updateLikeService(postId, req.user?.userId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Like has been retrieved successfully',
    data,
  })
})


export const updateCommentReactionsController = catchAsync(async (req, res) => {
    const { postId } = req.params
  const data = await updateCommentReactionsServices(postId, req.user?.userId, req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Reactions has been retrieved successfully',
    data,
  })
})



export const updateBookmarkController = catchAsync(async (req, res) => {
  const { postId } = req.params
  const user = req.user;

  const data = await updateBookmarkService(postId, user)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post has been updated successfully',
    data,
  })
})


export const createCommentController = catchAsync(async (req, res) => {
  const postId  = new Types.ObjectId(req.params.postId)
  const user = req.user;

  const data = await createCommentService(postId, req.body, user )

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'comment has been successfully',
    data,
  })
})