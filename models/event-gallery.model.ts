import { DataTypes, Sequelize } from "sequelize";
import BaseModel from "./base";
import { EventModel } from "./event.model";

export class EventGalleryModel extends BaseModel {
  declare name: string;
  declare type: string;
  declare url: string;
  declare eventId: string;
}

export default function init(sequelize: Sequelize): typeof EventGalleryModel {
  EventGalleryModel.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false },
      url: { type: DataTypes.STRING, allowNull: false },
      eventId: { type: DataTypes.BIGINT },
    },
    { sequelize, tableName: "event_gallery", modelName: "EventGallery" }
  );

  return EventGalleryModel;
}
