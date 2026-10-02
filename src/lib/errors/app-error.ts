export type ServiceErrorCode =
  | 'network'
  | 'permission'
  | 'validation'
  | 'not_found'
  | 'configuration'
  | 'unknown';

/**
 * Safe text for a caller. Never built from a Supabase or Zod message.
 * The public pages translate `code` themselves and do not render this string.
 */
const CLIENT_MESSAGES: Record<ServiceErrorCode, string> = {
  network: 'Не удалось связаться с сервером. Попробуйте ещё раз.',
  permission: 'Недостаточно прав для этого действия.',
  validation: 'Данные не прошли проверку и не могут быть показаны.',
  not_found: 'Запись не найдена.',
  configuration: 'Сервис временно недоступен.',
  unknown: 'Что-то пошло не так. Попробуйте ещё раз.',
};

export function clientMessage(code: ServiceErrorCode): string {
  return CLIENT_MESSAGES[code];
}

type AppErrorOptions = {
  code: ServiceErrorCode;
  message?: string;
  originalError?: unknown;
  context?: Record<string, unknown>;
};

/**
 * Server-side error. `originalError` and `context` stay in logs.
 * Callers that cross into the UI receive `toPublicError` instead of this class.
 */
export class AppError extends Error {
  readonly code: ServiceErrorCode;
  readonly originalError?: unknown;
  readonly context?: Readonly<Record<string, unknown>>;

  constructor(options: AppErrorOptions) {
    super(options.message ?? clientMessage(options.code));
    this.name = 'AppError';
    this.code = options.code;
    this.originalError = options.originalError;
    this.context = options.context;
  }
}

/** Same class. Services throw nothing; they log an AppError and return a Result. */
export { AppError as ServiceError };

export type PublicError = {
  code: ServiceErrorCode;
  message: string;
};

export function toPublicError(error: AppError): PublicError {
  return { code: error.code, message: error.message };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readString(value: unknown, key: string): string | undefined {
  if (!isRecord(value)) return undefined;
  const field = value[key];
  return typeof field === 'string' && field.length > 0 ? field : undefined;
}

function isNetworkFailure(error: unknown, message: string): boolean {
  if (error instanceof TypeError) return true;
  return /fetch failed|failed to fetch|networkerror|econnrefused|enotfound|etimededout|etimedout|socket/i.test(
    message,
  );
}

function isPermissionFailure(code: string | undefined, message: string): boolean {
  if (code === '42501' || code === 'PGRST301' || code === 'PGRST302' || code === '401' || code === '403') {
    return true;
  }
  return /permission denied|row-level security|jwt expired|invalid jwt|not authorized/i.test(message);
}

export function toAppError(error: unknown, context?: Record<string, unknown>): AppError {
  if (error instanceof AppError) {
    return new AppError({
      code: error.code,
      message: error.message,
      originalError: error.originalError,
      context: { ...error.context, ...context },
    });
  }

  const code = readString(error, 'code');
  const message = error instanceof Error ? error.message : (readString(error, 'message') ?? '');

  if (isNetworkFailure(error, message)) {
    return new AppError({ code: 'network', originalError: error, context });
  }

  if (isPermissionFailure(code, message)) {
    return new AppError({ code: 'permission', originalError: error, context });
  }

  if (code === 'PGRST116') {
    return new AppError({ code: 'not_found', originalError: error, context });
  }

  if (isRecord(error) && error.name === 'ZodError') {
    return new AppError({ code: 'validation', originalError: error, context });
  }

  return new AppError({ code: 'unknown', originalError: error, context });
}

function causeSummary(error: unknown): { name?: string; code?: string; message?: string } | undefined {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }
  const code = readString(error, 'code');
  const message = readString(error, 'message');
  if (!code && !message) return undefined;
  return { code, message };
}

/** Server logs include the cause. The browser log is only the public code and message. */
export function logAppError(error: AppError): void {
  const payload: Record<string, unknown> = {
    source: 'service',
    code: error.code,
    message: error.message,
    context: error.context ?? {},
  };

  if (typeof window === 'undefined') {
    const cause = causeSummary(error.originalError);
    if (cause) payload.cause = cause;
  }

  const line = `${JSON.stringify(payload)}\n`;
  if (typeof window === 'undefined') {
    // stderr, not console.error: Next.js treats console.error as an uncaught overlay.
    process.stderr.write(line);
    return;
  }

  console.error(line.trim());
}
