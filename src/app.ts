import express from 'express'
const app = express()
import cors from 'cors'
import { StudentRoutes } from './app/modules/student/student.route'

// parsers
app.use(express.json())
app.use(cors())

app.use('/api/v1/students', StudentRoutes)

app.get('/', (req, res) => {
  res.send('Hello, Dining management world!')
})

export default app
