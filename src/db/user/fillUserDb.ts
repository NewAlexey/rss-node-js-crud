import { BaseDataBase } from "../base-db";
import { UserModel } from "../../models/UserModel";

import { createMockUser } from "./createMockUser";

const DEFAULT_USER_COUNT = 10;

export function fillUserDb(db: BaseDataBase<UserModel>) {
  for (let i = 0; i < DEFAULT_USER_COUNT; i++) {
    const user = createMockUser();
    db.add(user);
  }
}
