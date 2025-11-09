import axios from 'axios';
import { logger } from '../logger';

export interface SendPasswordEmailPayload {
  teacher_id: number;
  teacher_email: string;
  teacher_name: string;
  token: string;
  expires_at: string;
  emailType?: 'setup' | 'recovery';
}

export async function sendPasswordEmail(payload: SendPasswordEmailPayload): Promise<void> {
  try {
    await axios.post(process.env.AZURE_FUNCTION_URL!, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    logger.info(
      `Password email sent to ${payload.teacher_email} as ${payload.emailType || 'setup'}`
    );
  } catch (error: any) {
    logger.error('Failed to send password email', { error: error?.message, payload });
    throw error;
  }
}
