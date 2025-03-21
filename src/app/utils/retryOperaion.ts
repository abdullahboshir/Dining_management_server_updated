const delay = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms))

export const retryOperation = async (
  operation: any,
  retries = 3,
  delayMs = 1000,
) => {
  let attempts = 0
  while (attempts < retries) {
    try {
      return await operation()
    } catch (error: any) {
      attempts++
      console.error(`❌ Attempt ${attempts} failed: ${error.message}`)
      if (attempts < retries) {
        console.log(`⏳ Retrying in ${delayMs / 1000} seconds...`)
        await delay(delayMs) // wait before retrying
      } else {
        console.error('❌ All retry attempts failed.')
        throw error // if all retries failed, rethrow the error
      }
    }
  }
}
