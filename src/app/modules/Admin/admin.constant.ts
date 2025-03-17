import { TBloodGroup, TDesignation, TGender } from './admin.interface'

export const Gender: TGender[] = ['Male', 'Female', 'Other']
export const Designation: TDesignation[] = ['Senior', 'Junior', 'Regular']

export const BloodGroup: TBloodGroup[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
]

export const AdminSearchableFields = [
  'email',
  'id',
  'contactNo',
  'emergencyContactNo',
  'name.firstName',
  'name.lastName',
  'name.middleName',
]
