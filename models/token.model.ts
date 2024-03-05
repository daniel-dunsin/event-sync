import { DataTypes, Sequelize } from "sequelize";
import { TokenType } from "../schema/enums/token.enum";
import BaseModel from "./base";

class TokenModel extends BaseModel {
  declare token: string;
  declare type: TokenType;
  declare email: string;
}

export default function init(sequelize: Sequelize): typeof TokenModel {
  TokenModel.init(
    {
      token: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.ENUM({ values: Object.values(TokenType) }), allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
    },
    { sequelize, tableName: "token", modelName: "Token" }
  );

  return TokenModel;
}
