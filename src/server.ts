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
