import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import crypto from 'crypto';
import { z } from 'zod';

// Logger interface - can be replaced with actual logger implementation
interface Logger {
  error: (message: string, error?: any) => void;
  warn: (message: string) => void;
  info: (message: string) => void;
}

// Simple console logger for now - can be replaced with Winston/Pino
const logger: Logger = {
  error: (message: string, error?: any) => {
    console.error(`[API Error] ${message}`, error);
  },
  warn: (message: string) => {
    console.warn(`[API Warning] ${message}`);
  },
  info: (message: string) => {
    console.info(`[API Info] ${message}`);
  },
};

// Standard error response shape
interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
  timestamp: string;
  requestId?: string;
}

// Success response wrapper
interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
  requestId?: string;
}

// Error codes mapping
const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMIT: 'RATE_LIMIT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

/**
 * Enhanced API error class
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: any;

  constructor(message: string, statusCode: number = 500, code: string = ERROR_CODES.INTERNAL_ERROR, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static badRequest(message: string, details?: any): ApiError {
    return new ApiError(message, 400, ERROR_CODES.VALIDATION_ERROR, details);
  }

  static unauthorized(message: string = 'Unauthorized'): ApiError {
    return new ApiError(message, 401, ERROR_CODES.UNAUTHORIZED);
  }

  static forbidden(message: string = 'Forbidden'): ApiError {
    return new ApiError(message, 403, ERROR_CODES.FORBIDDEN);
  }

  static notFound(message: string = 'Resource not found'): ApiError {
    return new ApiError(message, 404, ERROR_CODES.NOT_FOUND);
  }

  static conflict(message: string, details?: any): ApiError {
    return new ApiError(message, 409, ERROR_CODES.CONFLICT, details);
  }

  static internal(message: string = 'Internal server error', details?: any): ApiError {
    return new ApiError(message, 500, ERROR_CODES.INTERNAL_ERROR, details);
  }
}

/**
 * Generate request ID for tracing
 */
function generateRequestId(): string {
  return `req_${crypto.randomUUID()}`;
}

/**
 * Create standardized error response
 */
function createErrorResponse(
  error: string,
  statusCode: number,
  code?: string,
  details?: any,
  requestId?: string
): NextResponse<ErrorResponse> {
  const response: ErrorResponse = {
    success: false,
    error,
    timestamp: new Date().toISOString(),
    requestId,
  };

  if (code) response.code = code;
  if (details) response.details = details;

  return NextResponse.json(response, { status: statusCode });
}

/**
 * Create standardized success response
 */
function createSuccessResponse<T>(
  data: T,
  message?: string,
  requestId?: string
): NextResponse<SuccessResponse<T>> {
  const response: SuccessResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
    requestId,
  };

  if (message) response.message = message;

  return NextResponse.json(response);
}

/**
 * Handle Prisma-specific errors
 */
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): ApiError {
  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      const target = error.meta?.target as string[] | undefined;
      const field = target?.[0] || 'field';
      return ApiError.conflict(`This ${field} already exists`, {
        field,
        code: error.code,
      });

    case 'P2025':
      // Record not found
      return ApiError.notFound('Record not found');

    case 'P2003':
      // Foreign key constraint violation
      return ApiError.badRequest('Invalid reference', {
        code: error.code,
      });

    case 'P2014':
      // Relation violation
      return ApiError.badRequest('Invalid relation', {
        code: error.code,
      });

    default:
      return ApiError.internal('Database error', {
        prismaCode: error.code,
        message: error.message,
      });
  }
}

/**
 * Main error handler wrapper
 */
export function withErrorHandler<T extends any[] = []>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const requestId = generateRequestId();
    const startTime = Date.now();

    try {
      // Log request start
      logger.info(`${request.method} ${request.url} - Request started [${requestId}]`);

      // Execute the handler
      const response = await handler(request, ...args);

      // Log request completion
      const duration = Date.now() - startTime;
      logger.info(`${request.method} ${request.url} - Request completed [${requestId}] - ${duration}ms`);

      // Add request ID to response headers if not already present
      response.headers.set('X-Request-ID', requestId);
      
      // If it's a JSON response, parse the body and overwrite requestId to align headers & body
      if (response.headers.get('content-type')?.includes('application/json')) {
        try {
          const body = await response.json();
          if (body && typeof body === 'object') {
            body.requestId = requestId;
            const newResponse = NextResponse.json(body, {
              status: response.status,
              headers: response.headers,
            });
            return newResponse;
          }
        } catch (e) {
          // If response body is not readable/parsed, just fallback
        }
      }

      return response;

    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      // Log the error
      logger.error(
        `${request.method} ${request.url} - Request failed [${requestId}] - ${duration}ms`,
        error
      );

      // Handle different error types
      if (error instanceof ApiError) {
        const response = createErrorResponse(
          error.message,
          error.statusCode,
          error.code,
          error.details,
          requestId
        );
        response.headers.set('X-Request-ID', requestId);
        return response;
      }

      // Handle Prisma errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const apiError = handlePrismaError(error);
        const response = createErrorResponse(
          apiError.message,
          apiError.statusCode,
          apiError.code,
          apiError.details,
          requestId
        );
        response.headers.set('X-Request-ID', requestId);
        return response;
      }

      // Handle Zod validation errors
      if (error instanceof z.ZodError || error.name === 'ZodError') {
        const response = createErrorResponse(
          'Validation failed',
          400,
          ERROR_CODES.VALIDATION_ERROR,
          error.errors || error.issues,
          requestId
        );
        response.headers.set('X-Request-ID', requestId);
        return response;
      }

      // Handle validation errors (like JSON parsing)
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        const response = createErrorResponse(
          'Invalid JSON in request body',
          400,
          ERROR_CODES.VALIDATION_ERROR,
          { originalError: error.message },
          requestId
        );
        response.headers.set('X-Request-ID', requestId);
        return response;
      }

      // Handle generic errors
      const response = createErrorResponse(
        process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : error.message || 'Internal server error',
        500,
        ERROR_CODES.INTERNAL_ERROR,
        process.env.NODE_ENV === 'production' ? undefined : { stack: error.stack },
        requestId
      );
      response.headers.set('X-Request-ID', requestId);
      return response;
    }
  };
}

/**
 * Helper function to create success responses with consistent format
 */
export function createApiResponse<T>(
  data: T,
  message?: string,
  statusCode: number = 200
): NextResponse {
  const requestId = generateRequestId();
  
  const response: SuccessResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
    requestId,
  };

  if (message) response.message = message;
  
  return NextResponse.json(response, {
    status: statusCode,
    headers: {
      'X-Request-ID': requestId,
    },
  });
}

/**
 * Helper function to validate request body
 */
export function validateRequestBody<T>(
  body: any,
  requiredFields: (keyof T)[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      missingFields.push(String(field));
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

export { ERROR_CODES, logger };
