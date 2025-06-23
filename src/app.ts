import express from 'express'
const app = express()
import cors from 'cors'
import router from './app/routes'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import notFound from './app/middlewares/notFound'
import cookieParser = require('cookie-parser')

// parsers
app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
// app.use(cors({ origin: 'https://hall-management-client.vercel.app', credentials: true }))

const allowedOrigins = [
  'http://localhost:3000',
  'https://hall-management-client.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS')); 
    }
  },
  credentials: true,
}));


app.use('/api/v1', router)

app.get('/', (req, res) => {
  res.send('Hello, Dining management world!')
})

app.use(globalErrorHandler)
app.use(notFound)

export default app
