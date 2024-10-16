export interface ControllerModel {
  controllerUrl: string;
  requestHandler: (
    url: string,
    method: string,
    otherQueryParams: string[],
  ) => Promise<unknown>;
}
