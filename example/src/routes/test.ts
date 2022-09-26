import { Router } from "express";

export default Router().get("/", (_, res) => {
  res.end("Ok from /test");
});
