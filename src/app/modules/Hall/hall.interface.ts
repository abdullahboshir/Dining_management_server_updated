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
  superAdmin: Types.ObjectId
  dining: Types.ObjectId
  hallName: string
  phoneNumber: string
  email: string
  numberOfSeats: number
  password: string
  address: string
  applicationStartDate: Date
  applicationEndDate: Date
  hallPolicies: THallPolicies
  hallSummary: THallSummary
}
