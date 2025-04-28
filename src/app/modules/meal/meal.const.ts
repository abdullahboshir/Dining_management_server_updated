export const mealInfoObj = {
  maintenanceFee: 0,
  totalDeposit: 0,
  currentDeposit: 0,
  // previousRefunded: 0,
  dueMaintenanceFee: 0,
  totalMeals: 0,
  mealFee: 0,
  totalSpecialMeals: 0,
  specialMealFee: 0,
  totalCost: 0,
  // dueDeposite: 0,
  refunded: 0,
}

export const mealSearchableFields = {
  maintenanceFee: 'number',
  currentDeposit: 'number',
  totalDeposit: 'number',
  dueMaintenanceFee: 'number',
  totalMeals: 'number',
  mealStatus: 'string',
  'student.roomNumber': 'string',
  'student.name.firstName': 'string',
  'student.name.middleName': 'string',
  'student.name.lastName': 'string',
  'student.user.email': 'string',
  'student.user.phoneNumber': 'string',
}
