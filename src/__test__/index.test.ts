import http, { IncomingMessage, ServerResponse } from "http";

import dotenv from "dotenv";

dotenv.config();

import { Server } from "../server";
import { DEFAULT_USER_COUNT } from "../db/user/fillUserDb";
import { UserModel } from "../models/UserModel";

const PORT = process.env.PORT || 2007;

describe("name", () => {
  let server: http.Server<typeof IncomingMessage, typeof ServerResponse>;

  beforeEach(() => {
    server = new Server(PORT).getServer();
  });

  afterEach(() => {
    server.close();
  });

  test("1) Server is initialized.", () => {
    expect(server).toBeDefined();
    server.close();
  });

  test("2) Server is available for request.", async () => {
    const response = await fetch(getServerUrl());
    const data = await response.json();
    expect(data).toBeDefined();
  });

  test("3) Server return user list by 'GET' request.", async () => {
    const response = await fetch(getDefaultUsersUrl());
    const data = await response.json();
    expect(Array.isArray(data)).toEqual(true);
  });

  test("4) Server return specific count of users.", async () => {
    const response = await fetch(getDefaultUsersUrl());
    const data = (await response.json()) as UserModel[];

    expect(data.length).toEqual(DEFAULT_USER_COUNT);
  });

  test("5) Server return user list and user on 0 index must be defined.", async () => {
    const response = await fetch(getDefaultUsersUrl());
    const data = (await response.json()) as UserModel[];
    const user: UserModel = data[0];

    expect(user).toBeDefined();
  });

  test("6) User should be math UserModel.", async () => {
    const response = await fetch(getDefaultUsersUrl());
    const data = (await response.json()) as UserModel[];
    const user: UserModel = data[0];

    expect(user.id).toBeDefined();
    expect(user.age).toBeDefined();
    expect(user.username).toBeDefined();
    expect(user.hobbies).toBeDefined();
  });

  test("7) Server should return not found status, if make request on nonexistent url.", async () => {
    const response = await fetch(`${getServerUrl()}/non-exist/url`);

    expect(response.status).toBe(404);
  });

  test("8) Server should return bad request status, if make request for update user-data without 'id' in query string.", async () => {
    const response = await fetch(updateUserDataUrl(""));

    expect(response.status).toBe(400);
  });

  test("9) Server should create and return new user, when make 'POST' request.", async () => {
    const mockUser = {
      hobbies: ["Typescript and testing", "hacking"],
      username: "HTML-Hacker_2007",
      age: 25,
    };

    const response = await fetch(getDefaultUsersUrl(), {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(mockUser),
    });

    expect(response.status).toBe(201);

    const user = (await response.json()) as UserModel;

    expect(user.id).toBeDefined();
    expect(user.username).toEqual(mockUser.username);
    expect(user.hobbies).toEqual(mockUser.hobbies);
    expect(user.age).toEqual(mockUser.age);
  });

  test("10) Server should return user by id by 'GET' request.", async () => {
    const response = await fetch(getDefaultUsersUrl());
    const data = (await response.json()) as UserModel[];
    const userId: string = data[0].id;

    const getUserByIdResponse = await fetch(getUserByIdUrl(userId));
    const user = (await getUserByIdResponse.json()) as UserModel;

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.age).toBeDefined();
    expect(user.username).toBeDefined();
    expect(user.hobbies).toBeDefined();
  });
});

function getServerUrl(): string {
  return `http://localhost:${PORT}/api`;
}

function getDefaultUsersUrl(): string {
  return `${getServerUrl()}/users`;
}

function updateUserDataUrl(id: string): string {
  return `${getDefaultUsersUrl()}/${id}`;
}

function getUserByIdUrl(id: string): string {
  return `${getDefaultUsersUrl()}/${id}`;
}
