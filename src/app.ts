import express from 'express'
const app = express()
import cors from 'cors'

app.get('/', (req, res) => {
  res.send('Hello, Dining management world!')
})

export default app
