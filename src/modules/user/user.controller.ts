import { validate } from "uuid";

import {
  ControllerModel,
  ControllerResponseType,
  RequestHandlerPropsType,
} from "../../core/ControllerModel";
import { UserModel } from "../../models/UserModel";
import { HttpBadRequest } from "../../core/models/HttpBadRequest";
import { HttpCodeEnum } from "../../core/CodeEnum";

import { UserService } from "./user.service";
import { userTypeGuard } from "./validation/userTypeGuard";
import { validateUserField } from "./validation/validateUserField";
import { validateUserFieldValues } from "./validation/validateUserFieldValues";
import { UserDTO } from "./user.dto";

export class UserController implements ControllerModel {
  public readonly controllerUrl: string = "users";
  private readonly maxQueryParameters = 1;

  private readonly userService: UserService = new UserService();

  public async requestHandler(
    props: RequestHandlerPropsType<unknown | undefined>,
  ): Promise<ControllerResponseType<unknown>> {
    const { queryParams, method, body, url } = props;

    if (queryParams.length > this.maxQueryParameters) {
      throw new HttpBadRequest();
    }

    if (url === this.controllerUrl && !queryParams.length) {
      if (method === "GET") {
        return this.getAllUsers();
      }

      if (method === "POST") {
        const userData = validateUserData(body);

        return this.createUser(userData);
      }
    }

    const [userId] = queryParams;

    if (!userId) {
      throw new HttpBadRequest();
    }

    if (!validate(userId)) {
      throw new HttpBadRequest("Invalid user id.");
    }

    if (method === "GET") {
      return this.getUser(userId);
    }

    if (method === "PUT") {
      console.log("body", body);

      const userData = validateUserData(body);

      return this.updateUser({ ...userData, id: userId });
    }

    if (method === "DELETE") {
      return this.deleteUser(userId);
    }

    throw new HttpBadRequest();
  }

  private async createUser(
    userData: UserDTO,
  ): Promise<ControllerResponseType<UserModel>> {
    return {
      data: this.userService.createUser(userData),
      code: HttpCodeEnum.CREATED,
    };
  }

  private async getAllUsers(): Promise<ControllerResponseType<UserModel[]>> {
    return { data: this.userService.getAllUsers(), code: HttpCodeEnum.OK };
  }

  private async updateUser(
    user: UserModel,
  ): Promise<ControllerResponseType<UserModel>> {
    return {
      data: this.userService.updateUser(user),
      code: HttpCodeEnum.CREATED,
    };
  }

  private async getUser(
    id: string,
  ): Promise<ControllerResponseType<UserModel>> {
    return { data: this.userService.getUserById(id), code: HttpCodeEnum.OK };
  }

  private async deleteUser(
    id: string,
  ): Promise<ControllerResponseType<string>> {
    return {
      data: this.userService.deleteUser(id),
      code: HttpCodeEnum.NO_CONTENT,
    };
  }
}

function validateUserData(body: unknown): never | UserDTO {
  const isUserValidData = userTypeGuard(body);

  if (!isUserValidData) {
    const validationError = validateUserField(body);
    throw new HttpBadRequest(validationError);
  }

  const valuesValidation = validateUserFieldValues(body);

  if (valuesValidation) {
    throw new HttpBadRequest(valuesValidation);
  }

  return body;
}
