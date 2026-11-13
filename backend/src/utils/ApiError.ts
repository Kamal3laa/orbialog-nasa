export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static notFound(resource: string, id?: string): ApiError {
    return new ApiError(
      404,
      'NOT_FOUND',
      id ? `${resource} '${id}' not found` : `${resource} not found`,
    );
  }

  static badRequest(message: string, details?: unknown): ApiError {
    return new ApiError(400, 'BAD_REQUEST', message, details);
  }

  static unprocessable(message: string, details?: unknown): ApiError {
    return new ApiError(422, 'VALIDATION_ERROR', message, details);
  }
}
