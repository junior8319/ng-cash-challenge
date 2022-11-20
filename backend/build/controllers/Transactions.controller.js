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
const jwtGenerator_1 = __importDefault(require("../helpers/jwtGenerator"));
const Transactions_service_1 = __importDefault(require("../services/Transactions.service"));
class TransactionsController {
    constructor() {
        this.getTransactions = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { authorization } = req.headers;
                if (!authorization)
                    return res.status(401)
                        .json({ message: 'Token não encontrado.' });
                const token = yield jwtGenerator_1.default.verify(authorization);
                if (!token)
                    return res.status(400).json({ message: 'Não foi possível obter dados do token desta pessoa.' });
                const transactionsList = yield this.service
                    .getTransactions(token.id);
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
                const { authorization } = req.headers;
                if (!authorization)
                    return res.status(400)
                        .json({ message: 'Token não encontrado.' });
                const isValidToken = yield jwtGenerator_1.default.verify(authorization);
                if (!isValidToken)
                    return res.status(400)
                        .json({ message: 'Token inválido.' });
                const newTransaction = yield this
                    .service.createTransaction(this.transaction, isValidToken.id);
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
        this.service = new Transactions_service_1.default();
    }
}
exports.default = new TransactionsController();
