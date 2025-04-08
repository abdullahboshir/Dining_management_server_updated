import { Model } from 'mongoose'
import { USER_ROLE } from './user.constant'

export type TUser = {
  id: string
  phoneNumber: string
  email: string
  password: string
  fullName: string
  needsPasswordChange: boolean
  passwordChangedAt: Date
  role: 'superAdmin' | 'admin' | 'manager' | 'student' | 'moderator'
  status: 'active' | 'inactive' | 'blocked'
  profileImg?: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export type TUserRole = keyof typeof USER_ROLE

export interface UserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser>
  isUserExistsByEmail(email: string): Promise<TUser>

  isPasswordMatched(plainPass: string, hashedPass: string): Promise<Boolean>

  isJWTIssuedBeforePasswordChanged(
    passwordChangedAtTime: Date,
    jwtIssuedTime: number,
  ): boolean
}
