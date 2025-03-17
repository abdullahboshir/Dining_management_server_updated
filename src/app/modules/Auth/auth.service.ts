import status from 'http-status'
import AppError from '../../errors/AppError'
import User from '../User/user.model'
import { TLoginUser } from './auth.interface'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../../config'
import bcrypt from 'bcrypt'
import { createToken, verifyToken } from './auth.utils'
import { sendEmail } from '../../utils/sendEmail'

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

  const jwtPayload = { userId: isUserExists.id, role: isUserExists.role }

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
  const isUserExists = await User.isUserExistsByCustomId(user?.userId)

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

  const isUserExists = await User.isUserExistsByCustomId(userId)

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

  const jwtPayload = { userId: isUserExists.id, role: isUserExists.role }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expired_in as string,
  )

  return {
    accessToken,
  }
}

export const forgetPasswordService = async (userId: string) => {
  const isUserExists = await User.isUserExistsByCustomId(userId)

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

  const jwtPayload = { userId: isUserExists.id, role: isUserExists.role }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  )

  const resetUILink = `${config.reset_pass_ui_link}?id${isUserExists.id}&token=${accessToken}`
  const emails =
    'samiunnoor71@gmail.com, allused2020@gmail.com, projuktiit.info@gmail.com'

  const userEmail = isUserExists.email

  const emailSend = sendEmail(emails, resetUILink)
  console.log('email sendedddddddddddd', emailSend)
}

export const resetPasswordService = async (
  token: string,
  payload: { id: string; newPassword: string },
) => {
  const isUserExists = await User.isUserExistsByCustomId(payload?.id)

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

  const decoded = verifyToken(token, config.jwt_access_secret as string)

  const { userId, role, iat } = decoded

  if (isUserExists.id !== userId && isUserExists.role !== role) {
    throw new AppError(status.FORBIDDEN, 'You are Forbidden')
  }

  const newHashedPass = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  )

  const updated = await User.findOneAndUpdate(
    { id: userId, role },
    {
      password: newHashedPass,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  )
}
