export class ApiError extends Error {
  public status: number;
  public code: string;
  public details?: string[];

  constructor(status: number, code: string, message: string, details?: string[]) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function errorResponse(err: ApiError | Error) {
  if (err instanceof ApiError) {
    return {
      code: err.code,
      message: err.message,
      details: err.details || []
    };
  }
  return { code: 'internal_error', message: err.message || 'Internal Server Error', details: [] };
}
