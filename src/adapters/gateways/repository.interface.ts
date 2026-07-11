import type { Result } from "@core/domain/errors/error.js";
import type { AppError } from "@core/domain/errors/error.js";

export interface Repository<T> {
  readonly save: (item: T) => Promise<Result<T, AppError>>;
  readonly findById: (id: string) => Promise<Result<T | null, AppError>>;
  readonly delete: (id: string) => Promise<Result<void, AppError>>;
}
