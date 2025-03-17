export const initialHallObj = (superAdminObjectId: any) => ({
  superAdmin: superAdminObjectId,
  hallName: 'Nazrul Hall',
  numberOfSeats: 500,
  phoneNumber: '01500000000',
  email: 'example@gmail.com',
  password: '@Unknown2025@',
  address: 'Dharmapur, Sadar Dakshin, Cumilla, Chattagram, Bangladesh',
  applicationStartDate: new Date(),
  applicationEndDate: new Date(),
  hallPolicies: {
    admissionCharge: 0,
    maintenanceCharge: 0,
    festivalCharge: 0,
  },
  hallSummary: {
    totalMaintenanceFee: 0,
    dueMaintenanceFee: 0,
    totalfestivalFee: 0,
    dueFestivalFee: 0,
  },
})

export const initialDiningObj = (hallObjectId: any) => ({
  hall: hallObjectId,
  diningName: 'Dining of Nazrul Hall',
  diningPolicies: {
    mealCharge: 0,
    specialMealCharge: 0,
    minimumDeposit: 0,
    reservedSafetyDeposit: 0,
  },
  diningSummary: {
    totalMeals: 0,
    totalSpecialMeals: 0,
    totalDepositedAmount: 0,
    totalExpendedAmount: 0,
    remainingAmount: 0,
  },
})
