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
        this.getTransactions = () => __awaiter(this, void 0, void 0, function* () {
            const transactions = yield Transaction_model_1.default.findAll({
                include: [
                    { model: Account_model_1.default, as: 'debited from' },
                    { model: Account_model_1.default, as: 'credited to' },
                ],
            });
            if (!transactions)
                return null;
            return transactions;
        });
        this.createTransaction = (receivedTransaction) => __awaiter(this, void 0, void 0, function* () {
            const { debitedAccountId, creditedAccountId } = receivedTransaction;
            if (!debitedAccountId || !creditedAccountId)
                return null;
            if (debitedAccountId === creditedAccountId)
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
        this.updateTransaction = (receivedTransaction) => __awaiter(this, void 0, void 0, function* () {
            if (!receivedTransaction || !receivedTransaction.id)
                return null;
            this.id = receivedTransaction.id;
            const transactionToUpdate = yield Transaction_model_1.default.findByPk(this.id);
            if (!transactionToUpdate)
                return null;
            this.value = receivedTransaction.value;
            if (this.value) {
                yield TransactionsService.undoTransaction(transactionToUpdate);
                yield TransactionsService.accountsService
                    .debitToAccount(this.value, transactionToUpdate.debitedAccountId);
                yield TransactionsService.accountsService
                    .creditToAccount(this.value, transactionToUpdate.creditedAccountId);
            }
            if (receivedTransaction.debitedAccountId) {
                this.debitedAccountId = receivedTransaction.debitedAccountId;
                this.value = transactionToUpdate.value;
                this.creditedAccountId = transactionToUpdate.creditedAccountId;
                yield TransactionsService.undoTransaction(transactionToUpdate);
                yield TransactionsService.accountsService
                    .debitToAccount(this.value, this.debitedAccountId);
                yield TransactionsService.accountsService
                    .creditToAccount(this.value, this.creditedAccountId);
            }
            if (receivedTransaction.creditedAccountId) {
                this.creditedAccountId = receivedTransaction.creditedAccountId;
                this.value = transactionToUpdate.value;
                this.debitedAccountId = transactionToUpdate.debitedAccountId;
                yield TransactionsService.undoTransaction(transactionToUpdate);
                yield TransactionsService.accountsService
                    .debitToAccount(this.value, this.debitedAccountId);
                yield TransactionsService.accountsService
                    .creditToAccount(this.value, this.creditedAccountId);
            }
            return transactionToUpdate;
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
