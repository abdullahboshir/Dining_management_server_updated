export type TUser = {
  id: string
  password: string
  needsPasswordChange: boolean
  passwordChangedAt: Date | null
  role: 'superAdmin' | 'admin' | 'manager' | 'student' | 'moderator'
  status: 'active' | 'inactive' | 'blocked'
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}
