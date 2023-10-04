import fastify, { FastifyReply, FastifyRequest } from "fastify";
import dotenv from "dotenv";
import lowdbPlugin from "./plugins/lowdbPlugin";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const myPort = Number(process.env.PORT) || 5050;

declare module "fastify" {
  interface FastifyInstance {
    db: any;
    dbTest: any;
  }
  interface FastifyContext {
    isAuthenticated: boolean;
    request: FastifyRequest;
    reply: FastifyReply;
  }
}

// App config
const app = fastify();

// Error Handler
const errorHandler = (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const statusCode = reply.statusCode == 200 ? 500 : reply.statusCode;
  reply.status(statusCode);
  reply.send(error);
};

app.setErrorHandler(errorHandler);

app.register(
  lowdbPlugin({
    connectionString: String(process.env.DB_PATH),
    pluginName: "db",
  })
);

export default app;
