import app from "./app";
import secrets from "./constants/secrets.const";

app.listen(secrets.port, () => {
  console.log(`⚡[server]: listening on port ${secrets.port}`);
});
