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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_model_1 = __importDefault(require("../database/models/Transaction.model"));
const Account_model_1 = __importDefault(require("../database/models/Account.model"));
const Accounts_service_1 = __importDefault(require("./Accounts.service"));
class TransactionsService {
    constructor() {
        this.getTransactions = (tokenId) => __awaiter(this, void 0, void 0, function* () {
            const debits = yield Transaction_model_1.default.findAll({
                where: { debitedAccountId: tokenId },
                include: [
                    { model: Account_model_1.default, as: 'debited from' },
                    { model: Account_model_1.default, as: 'credited to', attributes: { exclude: ['balance'] } },
                ],
            });
            const credits = yield Transaction_model_1.default.findAll({
                where: { creditedAccountId: tokenId },
                include: [
                    { model: Account_model_1.default, as: 'debited from', attributes: { exclude: ['balance'] } },
                    { model: Account_model_1.default, as: 'credited to' },
                ],
            });
            const transactions = [...debits, ...credits];
            if (!transactions)
                return null;
            return transactions;
        });
        this.createTransaction = (receivedTransaction, tokenId) => __awaiter(this, void 0, void 0, function* () {
            const { debitedAccountId, creditedAccountId } = receivedTransaction;
            if (!debitedAccountId || !creditedAccountId)
                return null;
            if (debitedAccountId === creditedAccountId)
                return null;
            if (debitedAccountId !== tokenId)
                return null;
            const newTransaction = yield Transaction_model_1.default
                .create(Object.assign({}, receivedTransaction));
            if (!newTransaction)
                return null;
            yield TransactionsService.accountsService
                .debitToAccount(newTransaction.value, newTransaction.debitedAccountId);
            yield TransactionsService.accountsService
                .creditToAccount(newTransaction.value, newTransaction.creditedAccountId);
            return newTransaction.dataValues;
        });
        this.deleteTransaction = (receivedId) => __awaiter(this, void 0, void 0, function* () {
            if (!receivedId)
                return null;
            this.id = receivedId;
            const transactionToDelete = yield Transaction_model_1.default.findByPk(this.id);
            if (!transactionToDelete)
                return null;
            yield TransactionsService.undoTransaction(transactionToDelete);
            yield transactionToDelete.destroy();
            return transactionToDelete;
        });
        TransactionsService.model = new Transaction_model_1.default();
        TransactionsService.accountsService = new Accounts_service_1.default();
    }
}
_a = TransactionsService;
TransactionsService.undoTransaction = (receivedTransaction) => __awaiter(void 0, void 0, void 0, function* () {
    const { value, creditedAccountId, debitedAccountId } = receivedTransaction;
    if (!receivedTransaction ||
        !value ||
        !creditedAccountId ||
        !debitedAccountId) {
        return null;
    }
    yield TransactionsService.accountsService
        .debitToAccount(value, creditedAccountId);
    yield TransactionsService.accountsService
        .creditToAccount(value, debitedAccountId);
});
exports.default = TransactionsService;
