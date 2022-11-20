import { DataTypes, Model } from 'sequelize';
import db from '.';
import UserModel from './User.model';

class AccountModel extends Model {
  public id!: number;
  
  public balance!: number;
}

AccountModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    underscored: false,
    timestamps: false,
    modelName: 'account',
    tableName: 'accounts',
  },
);

UserModel.hasOne(AccountModel, { foreignKey: 'id', as: 'account' });
AccountModel.belongsTo(UserModel, { foreignKey: 'id', as: 'user' });

export default AccountModel;
