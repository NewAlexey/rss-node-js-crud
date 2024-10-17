import http from "http";

import { UserController } from "./modules/user/user.controller";
import {
  ControllerModel,
  ControllerResponseType,
} from "./core/ControllerModel";
import { HttpNotFoundError } from "./core/models/HttpNotFoundError";
import { BaseHttpError } from "./core/models/BaseHttpError";
import { HttpBadRequest } from "./core/models/HttpBadRequest";
import { HttpCodeEnum } from "./core/CodeEnum";

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

      const data: Buffer[] = [];
      let body = "";

      request.on("data", (chunk) => {
        data.push(chunk);
      });
      request.on("end", async () => {
        try {
          body = JSON.parse(Buffer.concat(data).toString());
        } catch (error) {
          this.errorHandler(response, error);

          return;
        }

        try {
          await this.responseHandler({
            controllerUrl,
            rest,
            response,
            method,
            body,
          });
        } catch (error) {
          this.errorHandler(response, error);
        }
      });
      request.on("error", (error) => this.errorHandler(response, error));
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
    body?: unknown;
  }) {
    const { controllerUrl, response, rest, method, body } = props;

    const { data, code } = await this.controllerHandler(
      controllerUrl,
      method,
      rest,
      body,
    );

    if (typeof data === "string") {
      response.setHeader("Content-type", "plain/text");
    } else if (typeof data === "object") {
      response.setHeader("Content-type", "application/json");
    }

    response.statusCode = code;
    response.end(JSON.stringify(data));
  }

  private controllerHandler(
    controllerUrl: string,
    method: string,
    restQueryParams: string[],
    body?: unknown,
  ): Promise<ControllerResponseType<unknown>> {
    const controller = this.controllerMapper.get(controllerUrl);

    if (!controller) {
      throw new HttpNotFoundError();
    }

    return controller.requestHandler({
      body,
      method,
      queryParams: restQueryParams,
      url: controllerUrl,
    });
  }

  private errorHandler(response: http.ServerResponse, error: unknown) {
    if (error instanceof SyntaxError) {
      response.statusCode = HttpCodeEnum.BAD_REQUEST;
      response.setHeader("Content-type", "plain/text");
      response.end(`Invalid Syntax. ${error.message}.`);

      return;
    }

    if (!(error instanceof Error)) {
      response.statusCode = HttpCodeEnum.BAD_REQUEST;
      response.setHeader("Content-type", "plain/text");
      response.end("Unknown error.");

      return;
    }

    if (error instanceof BaseHttpError) {
      response.statusCode = error.code;
      response.setHeader("Content-type", "application/json");
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
