import { Request, Response } from 'express';
import { HealthService } from '../services/health.service';

const healthService = new HealthService();

export class HealthController {
  check = (_req: Request, res: Response): void => {
    const status = healthService.getStatus();
    const httpStatus = status.status === 'ok' ? 200 : 503;
    res.status(httpStatus).json(status);
  };
}
