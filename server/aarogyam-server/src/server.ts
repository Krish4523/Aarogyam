import app from "./app";
import env from "./configs/env";

app.listen(env.PORT, () => {
  console.log(`MAIN SERVICE: http://localhost:${env.PORT}`);
});
