import { DbModel } from "../schema/types/db.type";
import BaseModel from "./base";
import { Sequelize, DataTypes } from "sequelize";

export class TicketModel extends BaseModel {
  declare type: string;
  declare totalNumber: number;
  declare stockCount: number;
  declare price: number;
  declare eventId: number;
}

export default function init(sequelize: Sequelize): typeof TicketModel {
  TicketModel.init(
    {
      type: { type: DataTypes.STRING, allowNull: false },
      totalNumber: { type: DataTypes.INTEGER, allowNull: false },
      stockCount: { type: DataTypes.INTEGER, allowNull: false },
      price: { type: DataTypes.DECIMAL, allowNull: false },
      eventId: { type: DataTypes.BIGINT, allowNull: false },
    },
    { modelName: "Ticket", tableName: "ticket", sequelize }
  );

  TicketModel.associate = (db: DbModel) => {
    TicketModel.belongsTo(db["Event"], { foreignKey: "eventId" });
  };

  return TicketModel;
}
