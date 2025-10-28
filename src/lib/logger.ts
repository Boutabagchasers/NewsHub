/**
 * Production-Ready Logger Utility
 * Provides structured logging with different levels and environment-aware behavior
 *
 * In development: Logs to console
 * In production: Can be extended to send to monitoring services (Sentry, Logtail, etc.)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * Log debug information (development only)
   */
  debug(message: string, context?: LogContext | unknown): void {
    if (this.isDevelopment) {
      console.debug('[DEBUG]', message, context || '');
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.info('[INFO]', message, context || '');
    }
    // In production, could send to analytics service
    if (this.isProduction) {
      // TODO: Send to monitoring service
      // Example: Sentry, Logtail, Axiom, etc.
    }
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.warn('[WARN]', message, context || '');
    }
    if (this.isProduction) {
      // Send warnings to monitoring in production
      // Could help identify issues before they become errors
    }
  }

  /**
   * Log error messages
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorDetails = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error;

    if (this.isDevelopment) {
      console.error('[ERROR]', message, errorDetails, context || '');
    }

    if (this.isProduction) {
      // In production, send to error tracking service
      // Example with Sentry:
      // Sentry.captureException(error, {
      //   tags: { context: message },
      //   extra: context,
      // });

      // For now, still log to console in production for CloudWatch/Vercel logs
      console.error('[ERROR]', message, errorDetails);
    }
  }

  /**
   * Log API request/response for debugging
   */
  api(method: string, path: string, status: number, duration?: number): void {
    const message = `${method} ${path} - ${status}${duration ? ` (${duration}ms)` : ''}`;

    if (status >= 500) {
      this.error(message);
    } else if (status >= 400) {
      this.warn(message);
    } else if (this.isDevelopment) {
      this.info(message);
    }
  }

  /**
   * Log RSS feed fetch operations
   */
  rss(source: string, status: 'success' | 'error', articleCount?: number, error?: Error): void {
    if (status === 'success') {
      this.info(`RSS fetch successful: ${source}`, { articleCount });
    } else {
      this.error(`RSS fetch failed: ${source}`, error);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Also export the class for testing
export { Logger };
