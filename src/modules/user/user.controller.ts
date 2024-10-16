import { ControllerModel } from "../../core/ControllerModel";
import { UserModel } from "../../models/UserModel";
import { HttpBadRequest } from "../../core/models/HttpBadRequest";

import { UserService } from "./user.service";

export class UserController implements ControllerModel {
  public readonly controllerUrl: string = "users";
  private readonly maxQueryParameters = 1;

  private readonly userService: UserService = new UserService();

  public async requestHandler(
    url: string,
    method: string,
    queryParams: string[],
  ): Promise<unknown> {
    if (queryParams.length > this.maxQueryParameters) {
      throw new HttpBadRequest();
    }

    if (url === this.controllerUrl && !queryParams.length) {
      if (method === "GET") {
        return this.getAllUsers();
      }

      if (method === "POST") {
        //TODO implement method
        return "POST user";
      }
    }

    const [userId] = queryParams;

    if (typeof String(userId) !== "string") {
      throw new HttpBadRequest("Invalid user id.");
    }

    if (method === "GET") {
      return this.getUser(userId);
    }

    if (method === "PUT") {
      //TODO implement method
      return this.getUser(userId);
    }

    if (method === "DELETE") {
      return this.deleteUser(userId);
    }

    throw new HttpBadRequest();
  }

  private async getAllUsers(): Promise<UserModel[]> {
    return this.userService.getAllUsers();
  }

  private async getUser(id: string): Promise<UserModel> {
    return this.userService.getUserById(id);
  }

  private async deleteUser(id: string): Promise<string> {
    return this.userService.deleteUser(id);
  }
}
