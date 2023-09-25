import "dotenv/config";
import _ from "lodash";
import { ApolloServer, BaseContext } from "@apollo/server";
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from "@as-integrations/fastify";
import app from "./app";

import bookTypeDefs from "./typeDefs/bookTypeDef";
import bookResolver from "./resolvers/bookResolver";
import userTypeDefs from "./typeDefs/userTypeDef";
import userResolver from "./resolvers/userResolver";

const myPort = Number(process.env.PORT) || 5050;

const baseTypeDefs = `
  type Query
  type Mutation
`;

const apollo = new ApolloServer<BaseContext>({
  typeDefs: [baseTypeDefs, bookTypeDefs, userTypeDefs],
  resolvers: _.merge({}, bookResolver, userResolver),
  plugins: [fastifyApolloDrainPlugin(app)],
});

await apollo.start();

await app.register(fastifyApollo(apollo));

app.listen({ port: myPort }, async (err: Error | null, address: string) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is listening at ${address}`);
});

export default app;
