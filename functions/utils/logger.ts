/**
 * Logger Estruturado
 * Centraliza logs com contexto e timestamp
 */

export class Logger {
  constructor(context = '') {
    this.context = context;
    this.startTime = Date.now();
    this.logs = [];
  }

  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const elapsed = Date.now() - this.startTime;
    
    const logEntry = {
      timestamp,
      level,
      context: this.context,
      message,
      data,
      elapsedMs: elapsed
    };

    this.logs.push(logEntry);

    // Imprimir no console com cor
    const prefix = `[${level.toUpperCase()}] ${this.context}`;
    const timeInfo = `(+${elapsed}ms)`;

    switch(level) {
      case 'error':
        console.error(`❌ ${prefix} ${message} ${timeInfo}`, data || '');
        break;
      case 'warn':
        console.warn(`⚠️  ${prefix} ${message} ${timeInfo}`, data || '');
        break;
      case 'info':
        console.info(`ℹ️  ${prefix} ${message} ${timeInfo}`, data || '');
        break;
      case 'debug':
        console.log(`🔍 ${prefix} ${message} ${timeInfo}`, data || '');
        break;
      case 'success':
        console.log(`✅ ${prefix} ${message} ${timeInfo}`, data || '');
        break;
      default:
        console.log(`${prefix} ${message} ${timeInfo}`, data || '');
    }
  }

  error(message, data) { this.log('error', message, data); }
  warn(message, data) { this.log('warn', message, data); }
  info(message, data) { this.log('info', message, data); }
  debug(message, data) { this.log('debug', message, data); }
  success(message, data) { this.log('success', message, data); }

  getLogs() {
    return this.logs;
  }

  getErrorSummary() {
    const errors = this.logs.filter(l => l.level === 'error');
    return {
      totalErrors: errors.length,
      errors: errors.map(e => ({ message: e.message, data: e.data }))
    };
  }

  export() {
    return {
      context: this.context,
      duration: Date.now() - this.startTime,
      totalLogs: this.logs.length,
      errors: this.getErrorSummary(),
      logs: this.logs
    };
  }
}

// Logger global singleton
let globalLogger = null;

export function getLogger(context) {
  if (!globalLogger) {
    globalLogger = new Logger(context);
  }
  return globalLogger;
}

export function resetLogger() {
  globalLogger = null;
}