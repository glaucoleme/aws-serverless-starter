import type { Result } from "@core/domain/errors/error.js";
import type { AppError } from "@core/domain/errors/error.js";

export type DomainEvent = {
  readonly source: string;
  readonly type: string;
  readonly detail: object;
};

export interface EventDispatcher {
  readonly dispatch: (event: DomainEvent) => Promise<Result<void, AppError>>;
}
