import { HttpCodeEnum } from "./CodeEnum";

export interface ControllerModel {
  controllerUrl: string;
  requestHandler: (
    props: RequestHandlerPropsType<undefined>,
  ) => Promise<ControllerResponseType<unknown>>;
}

export type RequestHandlerPropsType<B> = {
  url: string;
  body?: B | unknown;
  method: string;
  queryParams: string[];
};

export type ControllerResponseType<D> = {
  data: D;
  code: HttpCodeEnum;
};
