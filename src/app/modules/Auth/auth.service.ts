import status from 'http-status'
import AppError from '../../errors/AppError'
import User from '../User/user.model'
import { TLoginUser } from './auth.interface'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../../config'
import bcrypt from 'bcrypt'
import { createToken, findRoleBaseUser, verifyToken } from './auth.utils'
import { sendEmail } from '../../utils/sendEmail'
import { Types } from 'mongoose'
import { USER_ROLE } from '../User/user.constant'
import { Admin } from '../Admin/admin.model'
import Student from '../Student/student.model'
import { Manager } from '../Manager/manager.model'

export const userLoginService = async (payload: TLoginUser) => {
  //   const isUserExists = await User.findOne({ id: payload.id })
  const isUserExists = await User.isUserExistsByEmail(payload?.email)

  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, 'User is not found')
  }

  const isDeleted = isUserExists.isDeleted

  if (isDeleted) {
    throw new AppError(status.FORBIDDEN, 'this User is deleted')
  }

  const userStatus = isUserExists.status

  if (userStatus === 'blocked') {
    throw new AppError(status.FORBIDDEN, 'this User is blocked')
  }

  if (userStatus === 'inactive') {
    throw new AppError(status.FORBIDDEN, 'this User is inactive')
  }

  if (
    !(await User.isPasswordMatched(payload.password, isUserExists.password))
  ) {
    throw new AppError(status.FORBIDDEN, 'password deos not matched')
  }

  const jwtPayload: any = {
    userId: isUserExists?._id,
    email: isUserExists?.email,
    role: isUserExists.role,
    id: isUserExists?.id,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expired_in as string,
  )

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expired_in as string,
  )

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: isUserExists?.needsPasswordChange,
  }
}

export const userChangePasswordService = async (
  user: JwtPayload,
  payload: { newPassword: string; oldPassword: string },
) => {
  const isUserExists = await User.isUserExistsByCustomId(
    user?.userId,
    user?.email,
  )

  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, 'User is not found')
  }

  const isDeleted = isUserExists.isDeleted
  if (isDeleted) {
    throw new AppError(status.FORBIDDEN, 'this User is deleted')
  }

  const userStatus = isUserExists.status
  if (userStatus === 'blocked') {
    throw new AppError(status.FORBIDDEN, 'this User is blocked')
  }

  if (userStatus === 'inactive') {
    throw new AppError(status.FORBIDDEN, 'this User is inactive')
  }

  if (
    !(await User.isPasswordMatched(payload.oldPassword, isUserExists.password))
  ) {
    throw new AppError(status.FORBIDDEN, 'password deos not matched')
  }

  const newHashedPass = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  )

  //   bd date
  //   new Date().setHours(new Date().getHours() + 6)

  await User.findOneAndUpdate(
    { id: user.userId, role: user.role },
    {
      password: newHashedPass,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  )

  return null
}

export const refreshTokenService = async (token: string) => {
  if (!token) {
    throw new AppError(status.UNAUTHORIZED, 'You are not authorized!')
  }

  const decoded = verifyToken(token, config.jwt_refresh_secret as string)

  const { userId, role, iat } = decoded

  const isUserExists = await User.isUserExistsById(userId)

  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, 'User is not found')
  }

  const isDeleted = isUserExists.isDeleted
  if (isDeleted) {
    throw new AppError(status.FORBIDDEN, 'this User is deleted')
  }

  const userStatus = isUserExists.status
  if (userStatus === 'blocked') {
    throw new AppError(status.FORBIDDEN, 'this User is blocked')
  }

  if (userStatus === 'inactive') {
    throw new AppError(status.FORBIDDEN, 'this User is inactive')
  }

  if (
    isUserExists?.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(
      isUserExists.passwordChangedAt,
      iat as number,
    )
  ) {
    throw new AppError(status.UNAUTHORIZED, 'You are not authorized')
  }

  const jwtPayload: any = {
    userId: isUserExists?._id,
    email: isUserExists?.email,
    role: isUserExists.role,
    id: isUserExists?.id,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expired_in as string,
  )

  return {
    accessToken,
  }
}

export const forgetPasswordService = async (payload: any) => {
 console.log('ddddddddddddddddddddddddddddddddddddddd', payload)

  
  let isUserExists;
  if(payload?.email){
    isUserExists = await User.isUserExistsByEmail(payload?.email)
  } else if(payload?.phoneNumber){
    isUserExists = await User.isUserExistsByPhoneNumber(payload?.emailOrPhoneNumber)
  }


  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, 'User is not found') 
  }

  const isDeleted = isUserExists.isDeleted
  if (isDeleted) {
    throw new AppError(status.FORBIDDEN, 'this User is deleted')
  }

  const userStatus = isUserExists.status
  if (userStatus === 'blocked') {
    throw new AppError(status.FORBIDDEN, 'this User is blocked')
  }

  if (userStatus === 'inactive') {
    throw new AppError(status.FORBIDDEN, 'this User is inactive')
  }

    const jwtPayload: any = {
    userId: isUserExists?._id,
    email: isUserExists?.email,
    role: isUserExists.role,
    id: isUserExists?.id,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '5m',
  )



  const resetUILink = `${config.reset_pass_ui_link}/reset-password?id=${isUserExists.id}&token=${accessToken}`
  const emails =
    'samiunnoor71@gmail.com, allused2020@gmail.com, projuktiit.info@gmail.com'

  const userEmail = isUserExists.email

  const emailSend = await sendEmail(emails, resetUILink)
  console.log('email sendedddddddddddd', emailSend.messageId)
  return emailSend.messageId
}


export const resetPasswordService = async (token: string, payload: any) => {
  const decoded = verifyToken(token, config.jwt_access_secret as string)

  const { userId, role, id, email } = decoded

  const isUserExists = await User.isUserExistsByCustomId(payload.id, email)

  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, 'User is not found')
  }

  const isDeleted = isUserExists.isDeleted
  if (isDeleted) {
    throw new AppError(status.FORBIDDEN, 'this User is deleted')
  }

  const userStatus = isUserExists.status
  if (userStatus === 'blocked') {
    throw new AppError(status.FORBIDDEN, 'this User is blocked')
  }

  if (userStatus === 'inactive') {
    throw new AppError(status.FORBIDDEN, 'this User is inactive')
  }

  if (isUserExists.id !== userId && isUserExists.role !== role) {
    throw new AppError(status.FORBIDDEN, 'You are Forbidden')
  }

  const newHashedPass = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  )
  const updated = await User.findOneAndUpdate(
    { _id: userId, role },
    {
      $set: {
        password: newHashedPass,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
      },
    },
    { new: true, runValidators: true, select: '+password' },
  )
console.log('updated user', updated)
  if (!updated) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to update password',
    )
  }

  return updated
}
