import mongoose from 'mongoose'

export type TDining = {
  superAdminId: mongoose.Schema.Types.ObjectId
  adminId: mongoose.Schema.Types.ObjectId
  diningName: string
  division: string
  district: string
  subDistrict: string
  alliance: string
  numberOfSeats: number
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
