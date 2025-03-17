// import { TDining } from './dining.interface'
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
