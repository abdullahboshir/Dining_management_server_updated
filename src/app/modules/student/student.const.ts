// export const studentSearchableFields = [
//   'name.firstName',
//   'name.middleName',
//   'name.lastName',
//   'phoneNumber',
//   'email',
//   'session',
//   'roomNumber',
//   'classRoll',
// ]

export const studentSearchableFields: Record<string, 'string' | 'number'> = {
  'name.firstName': 'string',
  'name.middleName': 'string',
  'name.lastName': 'string',
  phoneNumber: 'string',
  email: 'string',
  roomNumber: 'number',
  session: 'string',
  classRoll: 'number',
}
