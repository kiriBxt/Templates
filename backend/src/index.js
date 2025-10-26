import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import socket from "@fastify/websocket";

import hooks from "./hooks/index.js";
import routes from "./routes/index.js";
import { migrate } from "./psql.js";

import "dotenv/config";

const { NODE_ENV, HOST, PORT, COOKIE_SECRET } = process.env;

const fastify = Fastify({
  logger: NODE_ENV === "dev" ? { level: "info" } : false,
});

async function registerCookies() {
  fastify.register(cookie, {
    secret: COOKIE_SECRET,
    parseOptions: {
      maxAge: 1000 * 60 * 60 * 24 * 1, // ms = sec * min * hour * day
      httpOnly: true,
      secure: NODE_ENV === "dev" ? false : true,
      sameSite: NODE_ENV === "dev" ? "none" : "lax",
      signed: true,
      path: "/",
    },
  });
}

async function registerCors() {
  fastify.register(cors, {
    origin: true,
    credentials: true,
  });
}

function errorHandler() {
  fastify.setErrorHandler((err, req, reply) => {
    // default wrapper for all errors
    console.log(err);
    reply.status(err.cause || 500).send({
      success: false,
      error: err.message || "Internal Server Error",
    });
  });
}

async function init() {
  try {
    await registerCookies();
    await registerCors();

    await fastify.register(hooks);
    await fastify.register(routes);
    await fastify.register(socket);

    errorHandler();
    migrate();
  } catch (error) {
    console.log(error);
  }
}

const start = async () => {
  try {
    await init();
    await fastify.listen({ port: Number(PORT), host: HOST });
    console.log(`server listening on http://${HOST}:${PORT}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();

process.on("SIGTERM", () => fastify.close());
process.on("SIGINT", () => fastify.close());
