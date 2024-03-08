import { DbModel } from "../schema/types/db.type";
import BaseModel from "./base";
import { Sequelize, DataTypes } from "sequelize";

export class TicketModel extends BaseModel {
  declare type: string;
  declare description: string;
  declare totalNumber: number;
  declare totalSold: number;
  declare price: number;
  declare eventId: number;
}

export default function init(sequelize: Sequelize): typeof TicketModel {
  TicketModel.init(
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      totalNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalSold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      eventId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    { modelName: "Ticket", tableName: "ticket", sequelize }
  );

  TicketModel.associate = (db: DbModel) => {
    TicketModel.belongsTo(db["Event"], { foreignKey: "eventId" });
  };

  return TicketModel;
}
