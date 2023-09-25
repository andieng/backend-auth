import fastify, { FastifyReply, FastifyRequest } from "fastify";
// import authRoute from "./routes/authRoute";

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

// Routes
// app.register(authRoute, { prefix: "/graphql" });

export default app;
