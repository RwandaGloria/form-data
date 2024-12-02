import { Response } from 'express';

export default (
  res: Response,
  status: number,
  data: any,
  message: string | undefined,
  error: string | undefined
): void => {
  res.status(status).json({
    status,
    data,
    message,
    error,
  });
};

