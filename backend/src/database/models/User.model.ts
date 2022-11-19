import { DataTypes, Model } from 'sequelize';
import db from '.';

class UserModel extends Model {
  public id!: number;

  public username!: string;

  public password!: string;

  public accountid!: number;
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    accountid: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    underscored: false,
    timestamps: false,
    modelName: 'user',
    tableName: 'users',
  },
);

export default UserModel;
