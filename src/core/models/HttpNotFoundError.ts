import { BaseHttpError } from "./BaseHttpError";

export class HttpNotFoundError extends BaseHttpError {
  constructor(message?: string) {
    super(message ?? "Not found.", 404);
  }
}
