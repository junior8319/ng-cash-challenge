"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = __importDefault(require("."));
const Account_model_1 = __importDefault(require("./Account.model"));
class TransactionModel extends sequelize_1.Model {
}
TransactionModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    debitedAccountId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    creditedAccountId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    value: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    sequelize: _1.default,
    underscored: false,
    timestamps: false,
    modelName: 'transaction',
    tableName: 'transactions',
});
TransactionModel.belongsTo(Account_model_1.default, { foreignKey: 'debitedAccountId', as: 'debited from' });
TransactionModel.belongsTo(Account_model_1.default, { foreignKey: 'creditedAccountId', as: 'credited to' });
exports.default = TransactionModel;
