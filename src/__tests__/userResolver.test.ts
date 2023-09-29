import bcrypt from "bcrypt";
import "jest";
import app from "../app";
import User from "../interfaces/UserInterface";
import {
  USER_ALREADY_EXISTS_ERROR,
  WRONG_PASSWORD_ERROR,
  WRONG_USERNAME_ERROR,
} from "../lib/constants";

const saltRounds = 10;

const testUser: User = {
  username: "__test_user__",
  password: "1",
};

const existUser: User = {
  username: "__exist_user__",
  password: "1",
};

// Create exist user and remove test user for register testing
let db: any;
beforeAll(async () => {
  await app.ready();
  db = app.db;
  db.read();
  const findUser = db.find(existUser.username);

  // Create exist user
  if (!findUser) {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPw = await bcrypt.hash(existUser.password, salt);
    const hashedUser: User = {
      username: existUser.username,
      password: hashedPw,
    };
    db.create(hashedUser);
  }

  // Remove test user
  db.remove(testUser.username);
});

// Remove test and exist user
afterAll(async () => {
  // db.remove(existUser.username);
  db.remove(testUser.username);
  await app.close();
});

describe("user register", () => {
  const regMutation = `
    mutation Register($username: String!, $password: String!) {
      register(username: $username, password: $password) {
        username
      }
    }
  `;
  test("should create new user if user doesn't exist", async () => {
    const toSend = JSON.stringify({
      query: regMutation,
      variables: testUser,
    });
    const reply = await app.inject({
      method: "POST",
      url: "/graphql",
      body: toSend,
      headers: {
        "Content-Type": "application/json",
      },
    });
    db.read();
    const findUser = db.find(testUser.username);
    expect(reply.statusCode).toBe(200);
    expect(findUser?.username).toBe(testUser.username);
  });

  test("should receive error msg in body if user exists", async () => {
    const toSend = JSON.stringify({
      query: regMutation,
      variables: existUser,
    });
    const reply = await app.inject({
      method: "POST",
      url: "/graphql",
      payload: toSend,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = JSON.parse(reply.body);
    expect(body).toHaveProperty("errors");
    expect(body.errors[0]).toHaveProperty("message", USER_ALREADY_EXISTS_ERROR);
  });
});

describe("user login", () => {
  const loginMutation = `
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        username
        accessToken
      }
    }
  `;
  test("should receive access token and other info if login successfully", async () => {
    const toSend = JSON.stringify({
      query: loginMutation,
      variables: existUser,
    });
    const reply = await app.inject({
      method: "POST",
      url: "/graphql",
      payload: toSend,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = JSON.parse(reply.body);
    expect(reply.statusCode).toBe(200);
    expect(body.data.login).toHaveProperty("username", existUser.username);
    expect(body.data.login).toHaveProperty("accessToken");
  });
  test("should receive error msg if user enters wrong username or not registered", async () => {
    const userInput: User = {
      username: "testuser",
      password: "1",
    };
    const toSend = JSON.stringify({
      query: loginMutation,
      variables: userInput,
    });
    const reply = await app.inject({
      method: "POST",
      url: "/graphql",
      payload: toSend,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = JSON.parse(reply.body);
    expect(body).toHaveProperty("errors");
    expect(body.errors[0]).toHaveProperty("message", WRONG_USERNAME_ERROR);
  });
  test("should receive error msg if user enters wrong password", async () => {
    const userInput = {
      username: "__test_user__",
      password: "123",
    };
    const toSend = JSON.stringify({
      query: loginMutation,
      variables: userInput,
    });
    const reply = await app.inject({
      method: "POST",
      url: "/graphql",
      payload: toSend,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = JSON.parse(reply.body);
    expect(body).toHaveProperty("errors");
    expect(body.errors[0]).toHaveProperty("message", WRONG_PASSWORD_ERROR);
  });
});
