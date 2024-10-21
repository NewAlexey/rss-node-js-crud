import { BaseDataBase } from "../base-db";
import { UserModel } from "../../models/UserModel";

import { fillUserDb } from "./fillUserDb";

const userDb = new BaseDataBase<UserModel>();

fillUserDb(userDb);

export { userDb };
