import { DataTypes, Sequelize } from "sequelize";
import { TokenType } from "../schema/enums/token.enum";
import BaseModel from "./base";

export class TokenModel extends BaseModel {
  declare token: string;
  declare code: number;
  declare type: TokenType;
  declare email: string;
}

export default function init(sequelize: Sequelize): typeof TokenModel {
  TokenModel.init(
    {
      token: { type: DataTypes.STRING, allowNull: false },
      code: { type: DataTypes.INTEGER, allowNull: false },
      type: { type: DataTypes.ENUM({ values: Object.values(TokenType) }), allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
    },
    { sequelize, tableName: "token", modelName: "Token" }
  );

  return TokenModel;
}
