import { HttpCodeEnum } from "../CodeEnum";

import { BaseHttpError } from "./BaseHttpError";

export class HttpNotFoundError extends BaseHttpError {
  constructor(message?: string) {
    super(message ?? "Not found.", HttpCodeEnum.NOT_FOUND);
  }
}
