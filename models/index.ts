import { Sequelize } from "sequelize";
import secrets from "../constants/secrets.const";
import { DbModel } from "../schema/types/db.type";
import { basename, join } from "path";
import { readdir } from "fs";
import ServiceException from "../schema/exceptions/service.exception";

const sequelize = new Sequelize(secrets.databaseUrl, {
  dialect: "postgres",
  logging: false,
});
const db: DbModel = {};
const filename = basename(__filename);

readdir(__dirname, async (err, files) => {
  if (err) throw new ServiceException(400, "unable to read models");
  const imports = await Promise.all(
    files
      .filter((file) => file != filename && file.indexOf(".") != -1 && (file.endsWith(".model.ts") || file.endsWith(".model.js")))
      .map(async (file) => await import(join(__dirname, file)))
  );

  //   run the init function in the models default export with sequelize variable
  imports.forEach((file) => {
    const model = file.default(sequelize);
    db[model.name] = model;
  });

  //   associate all models
  Object.values(db).forEach((model) => {
    if (model.associate) model.associate(db);
  });

  sequelize.sync({ force: true });
});

export { sequelize, db };
