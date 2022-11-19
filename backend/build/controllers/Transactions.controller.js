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
const Transactions_service_1 = __importDefault(require("../services/Transactions.service"));
class AccountsController {
    constructor() {
        this.getTransactions = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const transactionsList = yield this.service
                    .getTransactions();
                if (!transactionsList || transactionsList.length === 0)
                    return res
                        .status(400).json({
                        message: 'Não encontramos transações cadastradas.',
                    });
                return res.status(200).json(transactionsList);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
        this.createTransaction = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.transaction = req.body;
                const newTransaction = yield this
                    .service.createTransaction(this.transaction);
                if (!newTransaction)
                    return res.status(400)
                        .json({ message: 'Não foi possível cadastrar esta transação.' });
                return res.status(201).json(newTransaction);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
        this.deleteTransaction = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id)
                    return res.status(400)
                        .json({
                        message: 'Por favor, nos passe um identificador(id) para excluir.',
                    });
                this.id = Number(id);
                const transactionToDelete = yield this.service.deleteTransaction(this.id);
                if (!transactionToDelete)
                    return res.status(404)
                        .json({
                        message: `Não encontramos pessoa usuária com o id ${this.id}`,
                    });
                return res.status(202).json({ message: 'Registro excluído com sucesso.' });
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
        this.updateTransaction = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id)
                    return res.status(400)
                        .json({
                        message: 'Por favor, nos passe um identificador(id) para alterar.',
                    });
                this.id = Number(id);
                const transactionToUpdate = (Object.assign(Object.assign({}, req.body), { id: this.id }));
                yield this.service.updateTransaction(transactionToUpdate);
                return res.status(200).json(transactionToUpdate);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
        this.service = new Transactions_service_1.default();
    }
}
exports.default = new AccountsController();
