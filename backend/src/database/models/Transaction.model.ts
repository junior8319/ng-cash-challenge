import { DataTypes, Model } from 'sequelize';
import db from '.';
import AccountModel from './Account.model';

class TransactionModel extends Model {
  public id!: number;

  public debitedAccountId!: number;
  
  public creditedAccountId!: number;

  public value!: number;
}

TransactionModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    debitedAccountId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    creditedAccountId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    underscored: false,
    timestamps: true,
    updatedAt: false,
    modelName: 'transaction',
    tableName: 'transactions',
  },
);

TransactionModel.belongsTo(AccountModel, { foreignKey: 'debitedAccountId', as: 'debited from' });
TransactionModel.belongsTo(AccountModel, { foreignKey: 'creditedAccountId', as: 'credited to' });

export default TransactionModel;
