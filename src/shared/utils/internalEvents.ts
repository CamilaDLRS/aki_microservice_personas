import { logger } from '../logger';

export function emitInternalEvent(eventName: string, payload: any) {
  // Placeholder for real message bus integration or HTTP call to Function 2
  logger.info({ event: eventName, payload }, 'Internal event emitted');
}
