type LogLevel = 'info' | 'warn' | 'error';

class Logger {
  private formatMessage(level: LogLevel, message: string, context?: unknown) {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  info(message: string, context?: unknown) {
    console.log(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: unknown) {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    const errorDetails = error instanceof Error ? { message: error.message, stack: error.stack } : error;
    const combinedContext = { ...(context || {}), errorDetails };
    console.error(this.formatMessage('error', message, combinedContext));
  }
}

export const logger = new Logger();
