import http from "http";

import { UserController } from "./modules/user/user.controller";
import { ControllerModel } from "./core/ControllerModel";
import { HttpNotFoundError } from "./core/models/HttpNotFoundError";
import { BaseHttpError } from "./core/models/BaseHttpError";

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
    const requestUrl = request.url;
    const requestMethod = request.method;

    if (!requestUrl || !requestMethod) {
      response.statusCode = 400;
      response.end("Bad Request.");

      return;
    }

    const [_, apiPrefix, controllerUrl, ...rest] = requestUrl.split("/");

    if (apiPrefix !== this.apiPrefix || !controllerUrl) {
      response.statusCode = 400;
      response.end("Bad Request.");

      return;
    }

    try {
      const controller = this.controllerMapper.get(controllerUrl);

      if (!controller) {
        throw new HttpNotFoundError();
      }

      const data = await controller.requestHandler(
        controllerUrl,
        requestMethod,
        rest,
      );

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
    } catch (error: unknown) {
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
}

export const serverHandler = (
  request: http.IncomingMessage,
  response: http.ServerResponse,
) => new ServerHandler(UserController).serverHandler(request, response);
