// import { TDining } from './dining.interface'
import { ObjectId, Types } from 'mongoose'
import { Dining } from './dining.model'

// no need to create dining manually because dining will be created automatically when server will be run.

/*export const createDiningService = async (payload: TDining) => {
  // const result = await Dining.create(payload)
  // return result
}*/

export const getAllDiningService = async () => {
  const getDinings = await Dining.findOne({})
  return getDinings
}


export const updateDiningService = async (id: Types.ObjectId, payload: any) => {
  console.log('updateDiningService called with id:', id, payload)
const updatedDining = await Dining.findOneAndUpdate(id, {$set: {diningPolicies: payload}}) 
return updatedDining;
}