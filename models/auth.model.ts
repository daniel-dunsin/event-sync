import { DataTypes, Sequelize } from "sequelize";
import BaseModel from "./base";
import { compare, genSaltSync, hash } from "bcryptjs";

export class AuthModel extends BaseModel {
  declare email: string;
  declare password: string;
  declare isVerified: boolean;

  async comparePassword(password: string): Promise<boolean> {
    return await compare(password, this.password);
  }
}

export default function init(sequelize: Sequelize): typeof AuthModel {
  AuthModel.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true, unique: true },
      email: { type: DataTypes.STRING, validate: { isEmail: true }, allowNull: false, unique: true },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        set(password: string) {
          if (password) {
            const saltFactor = genSaltSync(10);
            const hashedPassword = hash(password, saltFactor);
            this.setDataValue("password", hashedPassword);
          }
        },
      },
      isVerified: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    },
    {
      sequelize,
      tableName: "auth",
      modelName: "Auth",
    }
  );

  return AuthModel;
}
