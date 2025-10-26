import Fastify from "fastify";

import "dotenv/config";

const { NODE_ENV, HOST, PORT } = process.env;

const fastify = Fastify({
  logger: NODE_ENV === "DEV" ? { level: "info" } : false,
});

fastify.get("/", () => {
  return { message: "ok" };
});

const start = async () => {
  try {
    await fastify.listen({ port: Number(PORT), host: HOST });
    console.log(`server listening on http://${HOST}:${PORT}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
start();
