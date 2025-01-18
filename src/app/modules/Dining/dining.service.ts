import { TDining } from './dining.interface'
import { Dining } from './dining.model'

export const createDiningService = async (payload: TDining) => {
  console.log('dddddddddddd', payload)
  const result = await Dining.create(payload)
  return result
}
