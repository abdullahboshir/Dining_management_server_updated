import express from 'express'
const app = express()
import cors from 'cors'
import router from './app/routes'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import notFound from './app/middlewares/notFound'

// parsers
app.use(express.json())
app.use(cors())

app.use('/api/v1', router)

app.get('/', (req, res) => {
  res.send('Hello, Dining management world!')
})

app.use(globalErrorHandler)
app.use(notFound)

export default app
