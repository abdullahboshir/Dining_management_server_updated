import { TAddress, TGuardian, TUserName } from './student.interface'

type NestedObject = TAddress | TUserName | TGuardian

export const updateMutableData = (
  sourceObj: NestedObject | undefined,
  modifiedObj: Record<string, unknown>,
  modifiedObjName: string,
): void => {
  if (!sourceObj) return

  for (const [key, value] of Object.entries(sourceObj)) {
    const newKey = `${modifiedObjName}.${key}`

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      updateMutableData(value as NestedObject, modifiedObj, newKey)
    } else {
      modifiedObj[newKey] = value
    }
  }
}
