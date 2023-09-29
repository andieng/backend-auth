import bcrypt from "bcrypt";
import User from "../interfaces/UserInterface";
import genAccessToken from "../config/genAccessToken";
import app from "../app";
import genRefreshToken from "../config/genRefreshToken";
import { FastifyContext } from "fastify";
import {
  NOT_AUTHENTICATED_ERROR,
  USER_ALREADY_EXISTS_ERROR,
  WRONG_PASSWORD_ERROR,
  WRONG_USERNAME_ERROR,
} from "../lib/constants";

const saltRounds = 10;

const userResolver = {
  Query: {
    users: (parent: any, args: any, context: FastifyContext, info: any) => {
      if (context.isAuthenticated) {
        app.db.read();
        const allUsers = app.db.findAll();
        return allUsers;
      } else {
        throw new Error(NOT_AUTHENTICATED_ERROR);
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
      app.db.read();
      const findUser = app.db.find(username);
      if (findUser) {
        throw new Error(USER_ALREADY_EXISTS_ERROR);
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPw = await bcrypt.hash(password, salt);

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
        throw new Error(WRONG_USERNAME_ERROR);
      }
      // Compare password
      if (!(await bcrypt.compare(password, findUser?.password))) {
        throw new Error(WRONG_PASSWORD_ERROR);
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
