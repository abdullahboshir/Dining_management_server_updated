export type TMealInfo = {
  [year: string]: {
    [month: string]: {
      mealStatus: 'off' | 'on'
      maintenanceFee: number
      totalDeposit: number
      currentDeposit: number
      lastMonthRefund: number
      lastMonthDue: number
      totalMeal: number
      mealCharge: number
      fixedMeal: number
      fixedMealCharge: number
      totalCost: number
      dueDeposite: number
      refundable: number
    }
  }
}
