import { UserModel } from "../../models/UserModel";

export type UserDTO = Omit<UserModel, "id">;
