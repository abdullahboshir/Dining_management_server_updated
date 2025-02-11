import { Server } from 'http'
import mongoose from 'mongoose'
import 'colors'
import app from './app'
import config from './app/config'

let server: Server

async function main() {
  try {
    if (!config.db_url) {
      console.log('Database URL is missing'.red)
      return
    }
    await mongoose.connect(config.db_url as string)
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`.green)
    })
  } catch (err) {
    console.log('got an error from server'.red)
  }
}

main()

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  if (server) {
    server.close(() => {
      console.log('Server is shutting down due to an unhandled rejection')
      process.exit(1)
    })
  } else {
    process.exit(1) // Exit immediately if server isn't available
  }
})

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message)
  console.error(err.stack) // Log the full stack trace
  if (server) {
    server.close(() => {
      console.log('Server is shutting down due to an uncaught exception')
      process.exit(1)
    })
  } else {
    process.exit(1) // Exit immediately if server isn't available
  }
})
