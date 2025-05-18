export const currentDateBD = () => {
  const currentDate = new Date()

  const currentDateInBD = new Date(
    currentDate.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }),
  )

  const currentDay = currentDateInBD.getDate()
  const currentMonth = currentDateInBD.toLocaleString('default', {
    month: 'long',
  })

  const currentYear = currentDateInBD.getFullYear().toString()

  return { currentYear, currentMonth, currentDay, currentDateInBD }
}

export const previousDateBD = () => {
  const currentDate = new Date()

  const currentDateInBD = new Date(
    currentDate.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }),
  )

  const currentMonthIndex = currentDateInBD.getMonth()
  const currentYear = currentDateInBD.getFullYear()

  // Calculate the previous month and the year
  let previousMonthIndex = currentMonthIndex - 1
  let previousYear = currentYear

  // If we are in January, we need to adjust the year and month
  if (previousMonthIndex < 0) {
    previousMonthIndex = 11
    previousYear = currentYear - 1
  }

  const previousMonth = new Date(
    currentYear,
    previousMonthIndex,
  ).toLocaleString('default', {
    month: 'long',
  })

  const lastDayOfPreviousMonth = new Date(
    previousYear,
    previousMonthIndex + 1,
    0,
  ).getDate()

  return {
    previousYear,
    previousMonth,
    lastDayOfPreviousMonth,
  }
}

export const getFutureDate = (
  yearsToAdd: number,
  monthsToAdd: number,
  daysToAdd: number,
) => {
  const currentDateInBD = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }),
  )

  const futureDate = new Date(currentDateInBD)

  // Add years, months, and days to the future date
  futureDate.setFullYear(futureDate.getFullYear() - yearsToAdd)
  futureDate.setMonth(futureDate.getMonth() - monthsToAdd)
  futureDate.setDate(futureDate.getDate() - daysToAdd)

  const futureYear = futureDate.getFullYear()
  const futureMonth = futureDate.toLocaleString('default', { month: 'long' })
  const futureDay = futureDate.getDate()

  return { futureYear, futureMonth, futureDay }
}

export const getLastDayOfMonth = (year: string, monthName: string): number => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const monthIndex = monthNames.indexOf(monthName)
  if (monthIndex === -1) {
    throw new Error('Invalid month name')
  }

  const lastDay = new Date(Number(year), monthIndex + 1, 0).getDate()
  return lastDay
}




export const generateDailyMealDate = (monthName: string, year: number): Record<string, number> => {
  const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth(); // 0-based index
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();

  const dailyMealHistory: Record<string, number> = {};
  for (let day = 1; day <= totalDays; day++) {
    dailyMealHistory[day.toString()] = 0; // default: 0 = no meal taken
  }

  return dailyMealHistory;
}
