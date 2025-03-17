export const countDueMaintenanceFee = async (mealInfo: any) => {
  let dueTotalMaintenanceCount = 0

  try {
    // Ensure mealInfo is defined and is an object
    if (
      mealInfo &&
      typeof mealInfo === 'object' &&
      Object.keys(mealInfo).length > 0
    ) {
      for (const year in mealInfo) {
        if (typeof mealInfo[year] !== 'object') continue // Skip invalid years

        for (const month in mealInfo[year]) {
          const monthData = mealInfo[year][month]

          // Ensure monthData is an object and has a valid maintenanceFee
          if (monthData && typeof monthData.maintenanceFee === 'number') {
            if (monthData.maintenanceFee === 0) {
              dueTotalMaintenanceCount++
            }
          } else {
            console.warn(`Skipping invalid month data:`, monthData)
          }
        }
      }
    }

    return dueTotalMaintenanceCount
  } catch (error: any) {
    console.error('Error calculating due months:', error.message)
    throw error
  }
}
