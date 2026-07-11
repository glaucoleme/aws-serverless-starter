export type LogContext = {
  readonly requestId: string;
  readonly correlationId: string;
};

export const createLogger = (context: LogContext) => {
  const log = (
    level: "INFO" | "WARN" | "ERROR",
    message: string,
    data?: object,
    durationMs?: number,
  ) => {
    const logEntry = {
      level,
      timestamp: new Date().toISOString(),
      ...context,
      message,
      ...(data && { data }),
      ...(durationMs !== undefined && { durationMs }),
    };
    // Using console.log as it is standard and safe for AWS CloudWatch
    console.log(JSON.stringify(logEntry));
  };

  return {
    info: (message: string, data?: object, durationMs?: number) =>
      log("INFO", message, data, durationMs),
    warn: (message: string, data?: object, durationMs?: number) =>
      log("WARN", message, data, durationMs),
    error: (message: string, data?: object, durationMs?: number) =>
      log("ERROR", message, data, durationMs),
  };
};
