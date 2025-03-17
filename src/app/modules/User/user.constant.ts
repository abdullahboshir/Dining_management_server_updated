export const USER_ROLE = {
  superAdmin: 'superAdmin',
  admin: 'admin',
  manager: 'manager',
  student: 'student',
  moderator: 'moderator',
} as const

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked',
}

export const USER_STATUS_ARRAY = Object.values(USER_STATUS)
