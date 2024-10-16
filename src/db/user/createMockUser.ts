import { randomUUID } from "crypto";

import { UserModel } from "../../models/UserModel";
import { randomNumberFromInterval } from "../../utils/randomNumberFromInterval";

export function createMockUser(): UserModel {
  return {
    username: usernameList[randomNumberFromInterval(0, 4)],
    hobbies: hobbies[randomNumberFromInterval(0, 4)],
    id: randomUUID(),
    age: randomNumberFromInterval(1, 80),
  };
}

const usernameList = ["John", "Lucy", "Amy", "Noah", "Sam"];
const hobbies = [
  [],
  ["TV", "Painting"],
  ["Something"],
  ["Walking", "Cinema", "Gaming", "Hm..."],
  ["Javascript Programming", "Typescript Programming", "Hm... wait what??"],
];
