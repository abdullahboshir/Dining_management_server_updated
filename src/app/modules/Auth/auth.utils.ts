import jwt, { JwtPayload } from 'jsonwebtoken'
import { Types } from 'mongoose';
import { USER_ROLE } from '../User/user.constant';
import { Manager } from '../Manager/manager.model';
import { Admin } from '../Admin/admin.model';
import User from '../User/user.model';
import { Student } from '../Student/student.model';

export const createToken = (
  jwtPayload: { userId: Types.ObjectId; role: string },
  secret: string,
  expiresIn: any,
) => {
  return jwt.sign(jwtPayload, secret as string, {
    expiresIn,
  })
}

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload
}


export const  findRoleBaseUser = async (id: string, email: string, role: string) => {
  let isRoleBaseUserExists;
  if (id && role === USER_ROLE.student) { 
    isRoleBaseUserExists = await Student.findOne({ id, email }).populate('user')
  }
  else if (id && role === USER_ROLE.moderator) {
    isRoleBaseUserExists = await Student.findOne({ id, email  }).populate('user')
  }
  else if (id && role === USER_ROLE.manager) {
    isRoleBaseUserExists = await Manager.findOne({ id, email  }).populate('user')    
  }
  else if (id && role === USER_ROLE.admin) {
    isRoleBaseUserExists = await Admin.findOne({ id, email  }).populate('user')
  }
  else if (role === USER_ROLE.superAdmin) {
    isRoleBaseUserExists = await User.findOne({ email })
  }

  return isRoleBaseUserExists;
};
