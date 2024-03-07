import { DataTypes, Sequelize } from "sequelize";
import BaseModel from "./base";
import { DEFAULT_IMAGES } from "../constants/image.const";
import { DbModel } from "../schema/types/db.type";
import { ON_DELETE_EVENTS } from "../schema/enums/db.enum";

export class UserModel extends BaseModel {
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare profilePicture: string;
  declare profilePictureId: string;
}

export default function init(sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: { type: DataTypes.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      profilePicture: { type: DataTypes.STRING, allowNull: false, defaultValue: DEFAULT_IMAGES.profilePicture },
      profilePictureId: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      tableName: "user",
      modelName: "User",
    }
  );

  UserModel.associate = (db: DbModel) => {
    UserModel.hasMany(db["Event"], { foreignKey: "userId", onDelete: ON_DELETE_EVENTS.SET_NULL });
  };

  return UserModel;
}
