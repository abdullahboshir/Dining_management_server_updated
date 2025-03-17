// import { startSession, Types } from 'mongoose'
// import { Dining } from '../Dining/dining.model'
// import { THall } from './hall.interface'
import { Hall } from './hall.model'

// no need to create dining manually because dining will be created automatically when server will be run.

/*export const createHallService = async (payload: THall) => {
  const diningObj = {
    diningName: 'Dining of ' + payload.hallName,
    diningPolicies: {
      mealCharge: 0,
      specialMealCharge: 0,
    },
  }

  const isDiningExist = await Dining.find()

  if (isDiningExist && isDiningExist.length === 1) {
    throw new Error('You have to craate just one dining')
  }

  const isHallExist = await Hall.find()

  if (isHallExist && isHallExist.length === 1) {
    throw new Error('You have to craate just one Hall')
  }

  const session = await startSession()

  try {
    session.startTransaction()

    const newDining = await Dining.create([diningObj], { session })

    if (!newDining.length) {
      throw new Error('Failed to create Dining!')
    }

    if (newDining[0] && newDining[0]._id instanceof Types.ObjectId) {
      payload.dining = newDining[0]._id
    } else {
      throw new Error('Invalid Dining data')
    }

    const result = await Hall.create([payload], { session })

    if (!result.length) {
      throw new Error('Failed to create Hall!')
    }

    const upatedDining = await Dining.findByIdAndUpdate(
      result[0].dining,
      { $set: { hall: result[0]._id } },
      { session },
    )

    if (!upatedDining) {
      throw new Error('Failed to update Dining!')
    }

    await session.commitTransaction()
    await session.endSession()
    return result
  } catch (error: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(error.message)
  }
}*/

export const getAllHallsService = async () => {
  const getHalls = await Hall.findOne({})
  return getHalls
}
