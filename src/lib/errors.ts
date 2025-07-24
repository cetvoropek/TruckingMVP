import { trackError } from './analytics';

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
    
    if (field) {
      this.message = `${field}: ${message}`;
    }
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND_ERROR', 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 'CONFLICT_ERROR', 409);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT_ERROR', 429);
    this.name = 'RateLimitError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network error occurred') {
    super(message, 'NETWORK_ERROR', 503);
    this.name = 'NetworkError';
  }
}

// Error handler for global error catching
export class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.handleError(event.reason, 'unhandledrejection');
      event.preventDefault();
    });

    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      console.error('Uncaught error:', event.error);
      this.handleError(event.error, 'uncaught');
    });
  }

  public handleError(error: unknown, context: string = ''): void {
    let processedError: AppError;

    if (error instanceof AppError) {
      processedError = error;
    } else if (error instanceof Error) {
      processedError = new AppError(
        error.message,
        'UNKNOWN_ERROR',
        500,
        false
      );
    } else {
      processedError = new AppError(
        'An unknown error occurred',
        'UNKNOWN_ERROR',
        500,
        false
      );
    }

    // Log error
    console.error(`[${processedError.code}] ${processedError.message}`, {
      context,
      stack: processedError.stack,
      statusCode: processedError.statusCode
    });

    // Track error in analytics
    trackError(processedError, context);

    // Show user-friendly error message
    this.showErrorToUser(processedError);
  }

  private showErrorToUser(error: AppError): void {
    // In a real app, you might use a toast notification library
    // For now, we'll use a simple alert
    if (error.isOperational) {
      // Show user-friendly message for operational errors
      this.showNotification(error.message, 'error');
    } else {
      // Show generic message for programming errors
      this.showNotification('An unexpected error occurred. Please try again.', 'error');
    }
  }

  private showNotification(message: string, type: 'error' | 'warning' | 'info' | 'success'): void {
    // Create a simple notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
      type === 'error' ? 'bg-red-500 text-white' :
      type === 'warning' ? 'bg-yellow-500 text-white' :
      type === 'success' ? 'bg-green-500 text-white' :
      'bg-blue-500 text-white'
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  // Utility method to wrap async functions with error handling
  public wrapAsync<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    context: string = ''
  ): (...args: T) => Promise<R | null> {
    return async (...args: T): Promise<R | null> => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handleError(error, context);
        return null;
      }
    };
  }

  // Utility method to wrap sync functions with error handling
  public wrapSync<T extends any[], R>(
    fn: (...args: T) => R,
    context: string = ''
  ): (...args: T) => R | null {
    return (...args: T): R | null => {
      try {
        return fn(...args);
      } catch (error) {
        this.handleError(error, context);
        return null;
      }
    };
  }
}

// Initialize global error handler
ErrorHandler.getInstance();

// Export utility functions
export const handleError = (error: unknown, context?: string) => {
  ErrorHandler.getInstance().handleError(error, context);
};

export const wrapAsync = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
) => {
  return ErrorHandler.getInstance().wrapAsync(fn, context);
};

export const wrapSync = <T extends any[], R>(
  fn: (...args: T) => R,
  context?: string
) => {
  return ErrorHandler.getInstance().wrapSync(fn, context);
};