import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { routes } from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

const app: Application = express();

app.use(cors());
app.use(cookieParser());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/api/v1', routes);

// global error handler
app.use(globalErrorHandler);

// server root page
app.use('/api/v1', (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Welcome To Modhunaghat Blood Bank Server",
  });
  next();
});

// handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

export default app;
