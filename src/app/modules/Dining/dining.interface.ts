import mongoose from 'mongoose'

export type TDining = {
  superAdminId: mongoose.Schema.Types.ObjectId
  adminId: mongoose.Schema.Types.ObjectId
  diningName: string
  divisionValue: string
  districtValue: string
  subDistrictValue: string
  allianceValue: string
  seatsNumber: number
  phoneNumber: string
  password: string
  applicationStartDate: string | null
  applicationEndDate: string | null
  applicationDate: Date
  passwordChangedAt: Date | null
  passwordResetToken: string | null
  passwordResetExpires: Date | null
  comparePassword(password: string): boolean // Method to compare password
}
