import app from "./app";
import secrets from "./constants/secrets.const";
import { sequelize } from "./models";

app.listen(secrets.port, async () => {
  console.log(`⚡[server]: listening on port ${secrets.port}`);
  try {
    await sequelize.sync({ alter: true });
    console.log(`⚡[database]: up and running`);
  } catch (error) {
    console.log(`❌[database]: unable to connect to db`, error);
  }
});
