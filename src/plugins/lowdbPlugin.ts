import { FastifyInstance, FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import DbOptionsInterface from "../types/interfaces/DbOptionsInterface";
import User from "../types/interfaces/UserInterface";

const lowdbPlugin = (dbOptions: DbOptionsInterface) => {
  const adapter = new FileSync(dbOptions.connectionString);
  const db = low(adapter);
  db.defaults({
    users: [],
  });
  const plugin: FastifyPluginCallback = fp(
    (fastify: FastifyInstance, opts: {}, done: Function) => {
      const result = {
        read(): void {
          db.read();
        },
        create(user: User): User {
          (<any>db.get("users")).push({ ...user }).write();
          return user;
        },
        remove(username: string): void {
          (<any>db.get("users")).remove({ username }).write();
        },
        find(username: string): User | undefined {
          const findUser = (<any>db.get("users"))
            .find((user: User) => user.username === username)
            .value();
          return findUser;
        },
        findByToken(refreshToken: string): User | undefined {
          const users = db.get("users").value();
          const findUser = users.find(
            (user: User) => user.refreshToken === refreshToken
          );
          return findUser;
        },
        findAll(): User[] | undefined {
          const users = db.get("users").value();
          return users;
        },
        updateByUsername(
          username: string,
          updateFields: {
            username?: string;
            password?: string;
            refreshToken?: string;
          }
        ): User | undefined {
          const users: User[] = db.get("users").value();
          const updateUser = users.find(
            (user: User) => user.username === username
          );

          if (updateUser) {
            let isChanged = false;
            const index = users.indexOf(updateUser);
            if (updateFields.username) {
              updateUser.username = updateFields.username;
              isChanged = true;
            }
            if (updateFields.password) {
              updateUser.password = updateFields.password;
              isChanged = true;
            }
            if (updateFields.refreshToken) {
              updateUser.refreshToken = updateFields.refreshToken;
              isChanged = true;
            }
            if (isChanged) {
              users[index] = updateUser;
              db.set("users", users).write();
            }
          }
          return updateUser;
        },
      };
      fastify.decorate(dbOptions.pluginName, result);

      done();
    }
  );

  return plugin;
};

export default lowdbPlugin;
