/**
 * Structured JSON logging utility.
 *
 * Writes log entries to stdout/stderr as newline-delimited JSON so they can
 * be ingested by any log aggregation service (Datadog, CloudWatch, etc.).
 *
 * Requirements: 10.1
 */

export type LogLevel = "info" | "warn" | "error";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  route?: string;
  method?: string;
  statusCode?: number;
  durationMs?: number;
  message?: string;
  error?: string;
  [key: string]: unknown;
}

function write(level: LogLevel, data: Omit<LogEntry, "timestamp" | "level">): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    ...data,
  };

  const line = JSON.stringify(entry);

  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  info(data: Omit<LogEntry, "timestamp" | "level">): void {
    write("info", data);
  },

  warn(data: Omit<LogEntry, "timestamp" | "level">): void {
    write("warn", data);
  },

  error(data: Omit<LogEntry, "timestamp" | "level">): void {
    write("error", data);
  },
};
