import { DataTypes, Sequelize } from "sequelize";
import { WalletTransactionDirection, WalletTransactionStatus } from "../schema/enums/payment.enum";
import BaseModel from "./base";
import { v4 } from "uuid";

export class WalletTransactionModel extends BaseModel {
  declare transaction_reference: string;
  declare walletId: number;
  declare direction: WalletTransactionDirection;
  declare amount: number;
  declare status: WalletTransactionStatus;
  declare reason: string;
}

export default function init(sequelize: Sequelize): typeof WalletTransactionModel {
  WalletTransactionModel.init(
    {
      transaction_reference: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        defaultValue: v4(),
      },
      walletId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      direction: {
        type: DataTypes.ENUM({ values: Object.values(WalletTransactionDirection) }),
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM({ values: Object.values(WalletTransactionStatus) }),
        allowNull: false,
        defaultValue: WalletTransactionStatus.PENDING,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "wallet_transaction",
      modelName: "WalletTransaction",
    }
  );

  return WalletTransactionModel;
}
