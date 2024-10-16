import http from "http";

import { UserController } from "./modules/user/user.controller";
import { ControllerModel } from "./core/ControllerModel";
import { HttpNotFoundError } from "./core/models/HttpNotFoundError";
import { BaseHttpError } from "./core/models/BaseHttpError";
import { HttpBadRequest } from "./core/models/HttpBadRequest";

class ServerHandler {
  private readonly apiPrefix: string = "api";
  private controllerMapper: Map<string, ControllerModel> = new Map();

  constructor(...controllers: (new () => ControllerModel)[]) {
    controllers.forEach((ControllerClass) => {
      const Instance = new ControllerClass();

      this.controllerMapper.set(Instance.controllerUrl, Instance);
    });
  }

  public async serverHandler(
    request: http.IncomingMessage,
    response: http.ServerResponse,
  ) {
    try {
      const { controllerUrl, method, rest } = this.requestHandler(
        request.url,
        request.method,
      );

      await this.responseHandler({
        controllerUrl,
        rest,
        response,
        method,
      });
    } catch (error: unknown) {
      this.errorHandler(response, error);
    }
  }

  private requestHandler(
    requestUrl: string | undefined,
    method: string | undefined,
  ): {
    controllerUrl: string;
    rest: string[];
    method: string;
  } {
    if (!requestUrl || !method) {
      throw new HttpBadRequest();
    }

    const [_, apiPrefix, controllerUrl, ...rest] = requestUrl.split("/");

    if (apiPrefix !== this.apiPrefix || !controllerUrl) {
      throw new HttpBadRequest();
    }

    return { controllerUrl, rest, method };
  }

  private async responseHandler(props: {
    controllerUrl: string;
    method: string;
    rest: string[];
    response: http.ServerResponse;
  }) {
    const { controllerUrl, response, rest, method } = props;

    const data = await this.controllerHandler(controllerUrl, method, rest);

    if (!data) {
      response.statusCode = 204;
    } else {
      if (typeof data === "string") {
        response.setHeader("Content-type", "plain/text");
      } else if (typeof data === "object") {
        response.setHeader("Content-type", "application/json");
      }
    }

    response.end(JSON.stringify(data));
  }

  private controllerHandler(
    controllerUrl: string,
    method: string,
    restQueryParams: string[],
  ): Promise<unknown> {
    const controller = this.controllerMapper.get(controllerUrl);

    if (!controller) {
      throw new HttpNotFoundError();
    }

    return controller.requestHandler(controllerUrl, method, restQueryParams);
  }

  private errorHandler(response: http.ServerResponse, error: unknown) {
    if (!(error instanceof Error)) {
      response.statusCode = 400;
      response.end("Unknown error.");

      return;
    }

    if (error instanceof BaseHttpError) {
      response.statusCode = error.code;
      response.end(
        JSON.stringify({ code: error.code, message: error.message }),
      );
    }
  }
}

export const serverHandler = (
  request: http.IncomingMessage,
  response: http.ServerResponse,
) => new ServerHandler(UserController).serverHandler(request, response);
