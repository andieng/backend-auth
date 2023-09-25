import bcrypt from "bcrypt";
import User from "../interfaces/UserInterface";
import db from "../config/connectDb";
import generateToken from "../config/generateToken";

const saltRounds = 10;
const users = db.get("users").value();

const userResolver = {
  Query: {
    users: () => users,
  },
  Mutation: {
    register: async (parent: any, args: User, context: any, info: any) => {
      const { username, password } = args;
      const salt = await bcrypt.genSaltSync(saltRounds);
      const hashedPw = await bcrypt.hash(password, salt);

      await db.read();
      const users = db.get("users").value();
      const findUser = users.find((user: User) => user.username === username);

      if (findUser) {
        throw new Error("User Already Exists");
      }

      // Create a new User
      const newUser: User = {
        username,
        password: hashedPw,
      };
      (<any>db.get("users")).push(newUser).write();

      return {
        username,
      };
    },
    login: async (parent: any, args: User, context: any, info: any) => {
      const { username, password } = args;
      await db.read();
      const users = db.get("users").value();
      const findUser = users.find((user: User) => user.username === username);

      // Check if user exists
      if (!findUser) {
        throw new Error("Wrong Username / User Not Registered Error");
      }
      if (!(await bcrypt.compare(password, findUser?.password))) {
        throw new Error("Wrong Password Error");
      }

      return {
        username,
        token: generateToken(username),
      };
    },
  },
};

export default userResolver;
