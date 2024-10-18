export function validateUserFieldValues(body: {
  age: unknown;
  hobbies: unknown;
  username: unknown;
}): string {
  const messageList: string[] = [];

  const hobbies = body.hobbies;

  if (typeof body.age !== "number") {
    messageList.push("'Age' must be 'number'.");
  }

  if (!Array.isArray(hobbies)) {
    messageList.push("'Hobbies' must be 'array'.");
  } else if (hobbies.length) {
    const isHobbiesValid = hobbies.some((hobby) => typeof hobby !== "string");

    if (isHobbiesValid) {
      messageList.push("'Hobbies' must be list of 'string'.");
    }
  }

  if (typeof body.username !== "string") {
    messageList.push("'Username' must be a 'string'.");
  }

  if (!messageList.length) {
    return "";
  }

  return `Invalid user field data. ${messageList.join(" ")}`;
}
