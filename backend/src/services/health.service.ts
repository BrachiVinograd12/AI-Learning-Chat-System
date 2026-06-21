import { config } from '../config';
import { getDatabaseStatus } from '../config/database';

export interface HealthStatus {
  status: 'ok' | 'degraded';
  service: string;
  environment: string;
  database: 'connected' | 'disconnected' | 'connecting';
  timestamp: string;
}

export class HealthService {
  getStatus(): HealthStatus {
    const database = getDatabaseStatus();

    return {
      status: database === 'connected' ? 'ok' : 'degraded',
      service: 'ai-learning-backend',
      environment: config.nodeEnv,
      database,
      timestamp: new Date().toISOString(),
    };
  }
}
