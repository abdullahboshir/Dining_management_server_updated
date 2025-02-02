import mongoose, { Types } from 'mongoose'

export type THallPolicies = {
  admissionCharge: number
  maintenanceCharge: number
  festivalCharge: number
}

export type THallSummary = {
  totalMaintenanceFee: number
  dueMaintenanceFee: number
  totalfestivalFee: number
  dueFestivalFee: number
}

export type THall = {
  superAdminId: Types.ObjectId
  diningId: Types.ObjectId
  hallName: string
  division: string
  district: string
  subDistrict: string
  alliance: string
  numberOfSeats: number
  phoneNumber: string
  password: string
  applicationStartDate: Date
  applicationEndDate: Date
  hallPolicies: THallPolicies
  hallSummary: THallSummary
  passwordChangedAt: Date
  passwordResetToken: string
  passwordResetExpires: Date
}
