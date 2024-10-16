import { BaseHttpError } from "./BaseHttpError";

export class HttpBadRequest extends BaseHttpError {
  constructor(message?: string) {
    super(message ?? "Bad request.", 400);
  }
}
