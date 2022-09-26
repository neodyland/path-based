import { Instance } from "../../dist";

(async () => {
  const app = new Instance();
  await app.prepare();
  await app.listen().then((port) => {
    console.log(`Listened as ${port}`);
  });
})();
