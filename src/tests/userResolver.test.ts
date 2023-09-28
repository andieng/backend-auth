import bcrypt from "bcrypt";
import app from "../app";
import User from "../interfaces/UserInterface";
import connectDb from "../config/connectDb";

const db = connectDb("src/database/db_test.json");
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
// beforeAll(async () => {
//   const dbUsers = db.get("users").value();
//   const findUser = dbUsers.find(
//     (dbUser: User) => dbUser.username === existUser.username
//   );

//   // Create exist user
//   if (!findUser) {
//     const salt = await bcrypt.genSaltSync(saltRounds);
//     const hashedPw = await bcrypt.hash(existUser.password, salt);
//     const hashedUser: User = {
//       username: existUser.username,
//       password: hashedPw,
//     };
//     (<any>db.get("users")).push(hashedUser).write();
//   }

//   // Remove test user
//   (<any>db.get("users")).remove({ username: testUser.username }).write();
// });

// // Remove test and exist user
// afterAll(() => {
//   (<any>db.get("users")).remove({ username: testUser.username }).write();
//   (<any>db.get("users")).remove({ username: existUser.username }).write();
// });

// describe("user register", () => {
//   test("should create new user if user doesn't exist", async () => {
//     const reply = await app.inject({
//       method: "POST",
//       url: "/api/user/register",
//       payload: testUser,
//     });
//     const dbUsers = db.get("users").value();
//     const findUser = dbUsers.find(
//       (dbUser: User) => (dbUser.username = testUser.username)
//     );

//     expect(findUser?.username).toBe(testUser.username);
//     expect(reply.statusCode).toBe(200);
//   });

//   test("should receive 409 if user exists", async () => {
//     const reply = await app.inject({
//       method: "POST",
//       url: "/api/user/register",
//       payload: existUser,
//     });

//     expect(reply.statusCode).toBe(409);
//   });
// });

// describe("user login", () => {
//   test("should receive 200 and ok message if login successfully", async () => {
//     const reply = await app.inject({
//       method: "POST",
//       url: "/api/user/login",
//       payload: testUser,
//     });

//     expect(reply.statusCode).toBe(200);
//     expect(JSON.parse(reply.payload)).toHaveProperty("msg");
//   });

//   test("should receive 401 if user enters wrong username or not registered", async () => {
//     const userInput: User = {
//       username: "testuser",
//       password: "1",
//     };

//     const reply = await app.inject({
//       method: "POST",
//       url: "/api/user/login",
//       payload: userInput,
//     });

//     expect(reply.statusCode).toBe(401);
//   });
//   test("should receive 401 if user enters wrong password", async () => {
//     const userInput = {
//       username: "__test_user__",
//       password: "123",
//     };
//     const reply = await app.inject({
//       method: "POST",
//       url: "/api/user/login",
//       payload: userInput,
//     });

//     expect(reply.statusCode).toBe(401);
//   });
// });
