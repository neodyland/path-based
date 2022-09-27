import { Router } from "../../../";

export default Router().get("/", (_, res) => {
  res.end("Ok from /test");
});
