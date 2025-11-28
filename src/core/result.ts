export class ResultSuccess<E, R> {
  readonly value: R;

  constructor(value: R) {
    this.value = value;
  }

  isError(): this is ResultError<E, R> {
    return false;
  }

  isSuccess(): this is ResultSuccess<E, R> {
    return true;
  }
}

export class ResultError<E, R> {
  readonly error: E;

  constructor(error: E) {
    this.error = error;
  }

  isError(): this is ResultError<E, R> {
    return true;
  }

  isSuccess(): this is ResultSuccess<E, R> {
    return false;
  }
}

export type Result<E, R> = ResultError<E, R> | ResultSuccess<E, R>;

export function success<E>(): Result<E, void>;
export function success<E, R>(value: R): Result<E, R>;
export function success<E, R>(value?: R): Result<E, R> {
  return new ResultSuccess<E, R>(value as R);
}

export function error<E, R>(error: E): Result<E, R> {
  return new ResultError<E, R>(error);
}
