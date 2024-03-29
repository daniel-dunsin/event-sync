import { DataTypes, Sequelize } from "sequelize";
import BaseModel from "./base";
import { DbModel } from "../schema/types/db.type";
import { EventModel } from "./event.model";

export class PurchasedTicketModel extends BaseModel {
  declare bookingId: string;
  declare ticketId: number;
  declare ticketsCount: number;
  declare amount: number;
  declare eventId: number;
  declare userId: number;
  declare qrCode: string;
  declare qrCodeUsed: boolean;
  declare paymentAttemptId: number;
}

export default function init(sequelize: Sequelize): typeof PurchasedTicketModel {
  PurchasedTicketModel.init(
    {
      ticketId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      ticketsCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      qrCode: {
        type: DataTypes.STRING(500000),
        allowNull: false,
      },
      qrCodeUsed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      bookingId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentAttemptId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "purchased_ticket",
      modelName: "PurchasedTicket",
    }
  );

  PurchasedTicketModel.associate = (db: DbModel) => {
    PurchasedTicketModel.belongsTo(db["Ticket"], { foreignKey: "ticketId" });
    PurchasedTicketModel.belongsTo(db["User"], { foreignKey: "userId", as: "user" });
    PurchasedTicketModel.belongsTo(db["PaymentAttempt"], { foreignKey: "paymentAttemptId" });
    PurchasedTicketModel.belongsTo(db["Event"], { foreignKey: "eventId", as: "event" });
  };

  return PurchasedTicketModel;
}
