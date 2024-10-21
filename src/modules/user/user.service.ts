import { UserModel } from "../../models/UserModel";
import { HttpNotFoundError } from "../../core/models/HttpNotFoundError";
import { userDb } from "../../db/user/user.db";
import { BaseDataBase } from "../../db/base-db";
import { UserDTO } from "./user.dto";

export class UserService {
  private readonly userRepository: BaseDataBase<UserModel>;

  constructor() {
    this.userRepository = userDb;
  }

  public createUser(userData: UserDTO): UserModel {
    return this.userRepository.add(userData);
  }

  public updateUser(user: UserModel): UserModel {
    return this.userRepository.update(user);
  }

  public getUserById(userId: string): UserModel {
    const user: UserModel | undefined = this.userRepository.get(userId);

    if (!user) {
      throw new HttpNotFoundError("User not found.");
    }

    return user;
  }

  public getAllUsers(): UserModel[] {
    return this.userRepository.getAll();
  }

  public deleteUser(userId: string): string {
    this.userRepository.remove(userId);

    return "User successfully deleted.";
  }
}
