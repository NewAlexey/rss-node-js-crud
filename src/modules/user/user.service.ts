import { UserModel } from "../../models/UserModel";
import { HttpNotFoundError } from "../../core/models/HttpNotFoundError";
import { userDb } from "../../db/user/user.db";

export class UserService {
  private readonly userRepository;

  constructor() {
    this.userRepository = userDb;
  }

  public getUserById(userId: string): UserModel {
    const user = this.userRepository.get(userId);

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
