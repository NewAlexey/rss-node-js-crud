import { HttpCodeEnum } from "../CodeEnum";

import { BaseHttpError } from "./BaseHttpError";

export class HttpBadRequest extends BaseHttpError {
  constructor(message?: string) {
    super(message ?? "Bad request.", HttpCodeEnum.BAD_REQUEST);
  }
}
