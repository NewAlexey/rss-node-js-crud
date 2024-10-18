import { UserModel } from "../../../models/UserModel";

export function userTypeGuard(
  body?: Omit<UserModel, "id"> | unknown,
): body is Omit<UserModel, "id"> {
  if (!body || typeof body !== "object") {
    return false;
  }

  if (!("age" in body)) {
    return false;
  }

  if (!("hobbies" in body)) {
    return false;
  }

  return "username" in body;
}
