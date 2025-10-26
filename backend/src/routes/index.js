import fs from "fs";
import path from "path";

const routeRoot = path.resolve("./src/routes");
const routeDirs = fs.readdirSync(routeRoot);

import { pathToFileURL } from "url";

export default async function routes(fastify) {
  await loader(fastify);
}

const loader = async (fastify) => {
  for (const dir of routeDirs) {
    if (dir.includes(".")) continue;
    const files = fs.readdirSync(path.join(routeRoot, dir));
    for (const file of files) {
      if (!file.endsWith(".js")) continue;
      const filePath = path.join(routeRoot, dir, file);

      const fileUrl = pathToFileURL(filePath).href;
      const module = (await import(fileUrl)).default;

      if (!module.enabled) continue;

      const allowed = ["GET", "POST", "PUT", "DELETE", "PATCH"];
      const method = module.method.toUpperCase();
      if (!allowed.includes(method))
        throw new Error(`Unsupported HTTP method: ${module.method}`);

      const url = `/${dir}${module.path}`;
      fastify.route({
        method,
        url,
        config: {
          permission: module.permission,
          bodyParams: module.bodyParams,
        },
        handler: module.execute,
      });
    }
  }
};
