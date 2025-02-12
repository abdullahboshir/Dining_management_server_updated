import config from '../config'
import { USER_ROLE } from '../modules/User/user.constant'
import User from '../modules/User/user.model'

const superUser = {
  id: '0001',
  email: 'superAdmin@gmail.com',
  password: config.super_admin_pass,
  needsPasswordChange: false,
  role: USER_ROLE.superAdmin,
  status: 'active',
  isDeleted: false,
}

const seedSuperAdmin = async () => {
  const isSuperAdminExists = await User.findOne({ role: USER_ROLE.superAdmin })

  if (!isSuperAdminExists) {
    await User.create(superUser)
  }
}

export default seedSuperAdmin
