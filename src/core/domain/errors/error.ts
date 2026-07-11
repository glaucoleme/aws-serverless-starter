// --- Core Result Type (Railway-Oriented) ---
export type Success<T> = { readonly tag: "success"; readonly value: T };
export type Failure<E> = { readonly tag: "failure"; readonly error: E };
export type Result<T, E> = Success<T> | Failure<E>;

export const success = <T>(value: T): Success<T> => ({ tag: "success", value });
export const failure = <E>(error: E): Failure<E> => ({ tag: "failure", error });

// --- Domain Errors (Business Logic Failures) ---
export type DomainError =
  | { readonly tag: "entity-not-found"; readonly message: string }
  | { readonly tag: "invalid-input"; readonly message: string }
  | { readonly tag: "conflict"; readonly message: string };

// --- Infrastructure Errors (System Failures) ---
export type InfrastructureError = {
  readonly tag: "system-failure";
  readonly message: string;
  readonly originalError?: unknown;
};

// --- Combined Application Error ---
export type AppError = DomainError | InfrastructureError;
