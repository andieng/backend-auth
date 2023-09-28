import bcrypt from "bcrypt";
import User from "../interfaces/UserInterface";
import genAccessToken from "../config/genAccessToken";
import app from "../app";
import genRefreshToken from "../config/genRefreshToken";
import { FastifyContext } from "fastify";

const saltRounds = 10;

const userResolver = {
  Query: {
    users: (parent: any, args: any, context: FastifyContext, info: any) => {
      if (context.isAuthenticated) {
        const allUsers = app.db.findAll();
        return allUsers;
      } else {
        throw new Error("Not Authenticated Error");
      }
    },
  },
  Mutation: {
    register: async (
      parent: any,
      args: User,
      context: FastifyContext,
      info: any
    ) => {
      const { username, password } = args;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPw = await bcrypt.hash(password, salt);

      app.db.read();

      const findUser = app.db.find(username);
      if (findUser) {
        throw new Error("User Already Exists");
      }

      // Create a new User
      const newUser: User = {
        username,
        password: hashedPw,
      };
      app.db.create(newUser);

      return {
        username,
      };
    },
    login: async (
      parent: any,
      args: User,
      context: FastifyContext,
      info: any
    ) => {
      const { username, password } = args;
      app.db.read();
      const findUser = app.db.find(username);

      // Check if user exists
      if (!findUser) {
        throw new Error("Wrong Username / User Not Registered Error");
      }
      // Compare password
      if (!(await bcrypt.compare(password, findUser?.password))) {
        throw new Error("Wrong Password Error");
      }
      const refreshToken = genRefreshToken(username);

      app.db.updateByUsername(username, {
        refreshToken,
      });

      return {
        username,
        accessToken: genAccessToken(username),
      };
    },
  },
};

export default userResolver;
