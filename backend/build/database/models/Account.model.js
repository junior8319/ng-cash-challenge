"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = __importDefault(require("."));
const User_model_1 = __importDefault(require("./User.model"));
class AccountModel extends sequelize_1.Model {
}
AccountModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    balance: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    sequelize: _1.default,
    underscored: false,
    timestamps: false,
    modelName: 'account',
    tableName: 'accounts',
});
User_model_1.default.hasOne(AccountModel, { foreignKey: 'id', as: 'account' });
AccountModel.belongsTo(User_model_1.default, { foreignKey: 'id', as: 'user' });
exports.default = AccountModel;
