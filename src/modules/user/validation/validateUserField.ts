import { UserModel } from "../../../models/UserModel";

export function validateUserField(
  body: Omit<UserModel, "id"> | unknown,
): string {
  const messageList: string[] = [];

  if (!body || typeof body !== "object") {
    return "Invalid user data. Missing object required fields - 'username', 'hobbies', 'age'.";
  }

  if (!("age" in body)) {
    messageList.push("age");
  }

  if (!("hobbies" in body)) {
    messageList.push("hobbies");
  }

  if (!("username" in body)) {
    messageList.push("username");
  }

  return `Invalid user data. Missing object required fields - ${messageList.join(", ")}`;
}
