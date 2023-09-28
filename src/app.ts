import fastify, { FastifyReply, FastifyRequest } from "fastify";
import lowdbPlugin from "./plugins/lowdbPlugin";

// Database plugin
declare module "fastify" {
  interface FastifyInstance {
    db: any;
  }
  interface FastifyContext {
    isAuthenticated: boolean;
    request: FastifyRequest;
    reply: FastifyReply;
  }
}

const myPort = Number(process.env.PORT) || 5050;

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
app.register(
  lowdbPlugin({
    connectionString: String(process.env.DB_TEST_PATH),
    pluginName: "dbTest",
  })
);

export default app;
