import { Instance } from "../../";

const server = new Instance();

// access to raw express app
server.app.use((req, _res, next) => {
  if (req.headers.authorization !== "Bearer {something}") {
    req.auth = false;
  }
  req.auth = true;
  return next();
});

// using
server
  .prepare()
  .then(() => server.listen())
  .then((port) => {
    console.log(`Listened as ${port}`);
  });

// types
declare global {
  namespace Express {
    export interface Request {
      auth?: boolean;
    }
  }
}
