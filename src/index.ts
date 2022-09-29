import { readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
const isDev = process.env.NODE_ENV !== "production";

import express from "express";
import { type Application, Router } from "express";

interface ReadFile {
  path: string;
  route: string;
}

const getRoutesPath = async (
  base = resolve(`${isDev ? "src" : "dist"}/routes`)
) => {
  const folders = [base];
  const files: ReadFile[] = [];
  while (folders.length) {
    const folder = folders.shift() as string;
    await readdir(folder, { withFileTypes: true }).then((paths) =>
      paths.map((path) => {
        const realpath = join(folder, path.name);
        if (path.isDirectory()) {
          folders.push(realpath);
        } else if (path.isFile()) {
          files.push({
            path: realpath,
            route: toRoute(realpath, base),
          });
        }
      })
    );
  }
  return files;
};

const toRoute = (path: string, base: string) => {
  return (
    path.slice(
      base.length,
      path.endsWith("index.ts") || path.endsWith("index.js") ? -9 : -3
    ) || "/"
  );
};

export class Instance {
  public app: Application;
  constructor(public port = 8080) {
    this.app = express();
  }
  async prepare(base?: string) {
    const paths = await getRoutesPath(base);
    paths.map(({ path, route }) =>
      this.app.use(route, (require(path)?.default ?? require(path)) as Router)
    );
  }
  async listen(port: number = this.port) {
    return new Promise((resolve) => this.app.listen(port, () => resolve(port)));
  }
}

export { Router };
