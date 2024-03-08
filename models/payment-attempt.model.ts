import { DataTypes, Sequelize } from "sequelize";
import { PaymentStatus } from "../schema/enums/payment.enum";
import BaseModel from "./base";

export class PaymentAttemptModel extends BaseModel {
  declare transaction_ref: string;
  declare amount: number;
  declare userId: number;
  declare ticketId: number;
  declare ticketsCount: number;
  declare status: PaymentStatus;
}

export default function init(sequelize: Sequelize): typeof PaymentAttemptModel {
  PaymentAttemptModel.init(
    {
      transaction_ref: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      ticketId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      ticketsCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM({ values: Object.values(PaymentStatus) }),
        allowNull: false,
        defaultValue: PaymentStatus.PENDING,
      },
    },
    {
      sequelize,
      tableName: "payment_attempt",
      modelName: "PaymentAttempt",
    }
  );

  return PaymentAttemptModel;
}
