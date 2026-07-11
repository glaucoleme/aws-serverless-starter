import type { Result } from "@core/domain/errors/error.js";
import type { AppError } from "@core/domain/errors/error.js";
import type { User } from "@core/domain/user.js";

export interface UserGateway {
  readonly save: (user: User) => Promise<Result<User, AppError>>;
  readonly findByEmail: (email: string) => Promise<Result<User | null, AppError>>;
  readonly findById: (id: string) => Promise<Result<User | null, AppError>>;
}
