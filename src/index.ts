import _ from "lodash";
import { ApolloServer } from "@apollo/server";
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from "@as-integrations/fastify";

import app from "./app";
import userTypeDefs from "./typeDefs/userTypeDef";
import userResolver from "./resolvers/userResolver";
import authMiddleware from "./middlewares/authMiddleware";
import MyContext from "./interfaces/MyContext";

const myPort = Number(process.env.PORT) || 5050;

const baseTypeDefs = `
  type Query
  type Mutation
`;

const apollo = new ApolloServer<MyContext>({
  typeDefs: [baseTypeDefs, userTypeDefs],
  resolvers: _.merge({}, userResolver),
  plugins: [fastifyApolloDrainPlugin(app)],
});

apollo.start().then(() => {
  app.register(fastifyApollo(apollo), {
    context: async (request: any, reply: any) => ({
      isAuthenticated: await authMiddleware(request),
      reply,
      request,
    }),
  });
  app.listen({ port: myPort }, async (err: Error | null, address: string) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server is listening at ${address}`);
  });
});

export default app;
