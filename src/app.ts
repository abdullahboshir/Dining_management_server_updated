import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

// === MIDDLEWARES ===
app.use(express.json());
app.use(cookieParser());

// === CORS CONFIG ===
const allowedOrigins = [
  'http://localhost:3000',
  'https://hall-management-client.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// For preflight requests
app.options('*', cors());

// === ROUTES ===
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('✅ Dining Management API is Live!');
});

// === ERROR HANDLING ===
app.use(globalErrorHandler);
app.use(notFound);

export default app;
