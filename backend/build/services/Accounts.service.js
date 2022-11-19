"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Account_model_1 = __importDefault(require("../database/models/Account.model"));
const User_model_1 = __importDefault(require("../database/models/User.model"));
class AccountsService {
    constructor() {
        this.getAccounts = () => __awaiter(this, void 0, void 0, function* () {
            const accountsList = yield Account_model_1.default.findAll({
                include: [
                    { model: User_model_1.default, as: 'user', attributes: { exclude: ['id', 'password'] } },
                ],
            });
            if (!accountsList)
                return null;
            return accountsList;
        });
        this.createAccount = (receivedAccount) => __awaiter(this, void 0, void 0, function* () {
            if (!receivedAccount)
                return null;
            const newAccount = yield Account_model_1.default.create(Object.assign({}, receivedAccount));
            return newAccount.dataValues;
        });
        this.creditToAccount = (receivedValue, receivedId) => __awaiter(this, void 0, void 0, function* () {
            if (!receivedValue || receivedValue <= 0 || !receivedId)
                return null;
            this.id = receivedId;
            const accountToCredit = yield Account_model_1.default.findByPk(this.id);
            if (!accountToCredit)
                return null;
            this.balance = accountToCredit.balance + receivedValue;
            yield accountToCredit.update({ balance: this.balance });
            return accountToCredit;
        });
        this.debitToAccount = (receivedValue, receivedId) => __awaiter(this, void 0, void 0, function* () {
            if (!receivedValue || receivedValue <= 0 || !receivedId)
                return null;
            this.id = receivedId;
            const accountToDebit = yield Account_model_1.default.findByPk(this.id);
            if (!accountToDebit)
                return null;
            if (accountToDebit.balance < receivedValue)
                return null;
            this.balance = accountToDebit.balance - receivedValue;
            yield accountToDebit.update({ balance: this.balance });
            return accountToDebit;
        });
        this.deleteAccount = (receivedId) => __awaiter(this, void 0, void 0, function* () {
            if (!receivedId)
                return null;
            this.id = Number(receivedId);
            const accountToDelete = yield Account_model_1.default.findByPk(this.id);
            if (!accountToDelete)
                return null;
            yield accountToDelete.destroy();
            return accountToDelete;
        });
        AccountsService.model = new Account_model_1.default();
    }
}
exports.default = AccountsService;
