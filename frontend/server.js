import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify();
const rootPath = path.join(__dirname, "public");

import "dotenv/config";
const { HOST, PORT } = process.env;

// Serve static assets
fastify.register(fastifyStatic, {
  root: rootPath,
  prefix: "/",
});

// SPA fallback
fastify.setNotFoundHandler((_req, reply) => {
  reply.type("text/html").sendFile("index.html");
});

fastify.listen({ host: HOST, port: Number(PORT) }, (err, address) => {
  if (err) throw err;
  console.log(`Server running at ${address}`);
});
