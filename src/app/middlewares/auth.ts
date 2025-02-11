import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import AppError from '../errors/AppError'
import status from 'http-status'
import jwt, { JwtPayload, verify } from 'jsonwebtoken'
import config from '../config'
import { TUserRole } from '../modules/User/user.interface'
import User from '../modules/User/user.model'
import { verifyToken } from '../modules/Auth/auth.utils'

const auth = (...requiredRole: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization

    if (!token) {
      throw new AppError(status.UNAUTHORIZED, 'You are not authorized!')
    }

    const decoded = verifyToken(token, config.jwt_access_secret as string)

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

    console.log('tokennnnnnnnnn', decoded)
    if (
      isUserExists?.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        isUserExists.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(status.UNAUTHORIZED, 'You are not authorized;;;;;;;;;')
    }

    if (requiredRole && !requiredRole.includes(role)) {
      throw new AppError(status.UNAUTHORIZED, 'You are not authorized')
    }

    req.user = decoded as JwtPayload

    next()
  })
}

export default auth
