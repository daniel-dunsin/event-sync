import { DataTypes, Sequelize } from "sequelize";
import BaseModel from "./base";

export class WalletModel extends BaseModel {
  declare userId: number;
  declare balance: number;
}

export default function init(sequelize: Sequelize): typeof WalletModel {
  WalletModel.init(
    {
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      balance: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: "wallet",
      modelName: "Wallet",
    }
  );

  return WalletModel;
}
