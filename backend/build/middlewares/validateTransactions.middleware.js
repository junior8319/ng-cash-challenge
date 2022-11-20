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
const Accounts_service_1 = __importDefault(require("../services/Accounts.service"));
const validateTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    if (!authorization)
        return res.status(401)
            .json({ message: 'Token não encontrado.' });
    const token = yield jwtGenerator_1.default.verify(authorization);
    if (!token)
        return res.status(401)
            .json({ message: 'Token inválido.' });
    const transaction = req.body;
    const accountsService = new Accounts_service_1.default();
    if (!transaction || Object.keys(transaction).length === 0)
        return res.status(400)
            .json({
            message: `Favor enviar uma transação válida
      no formato de objeto:
      {
        "debitedAccountId": <numérico inteiro>,
        "creditedAccountId": <numérico inteiro>,
        "value": <numérico com 2 casas decimais>
      }`
        });
    const { debitedAccountId } = transaction;
    if (!debitedAccountId)
        return res.status(400)
            .json({
            message: 'Favor enviar o identificador da conta para débito',
        });
    const debitAccount = yield accountsService.getAccountById(debitedAccountId, token.id);
    if (!debitAccount)
        return res.status(404).json({
            message: 'Não foi possível encontrar conta para débito.'
        });
    if (debitedAccountId !== token.id)
        return res.status(400)
            .json({
            message: 'Você não pode debitar de uma conta que não seja a sua.'
        });
    const { creditedAccountId } = transaction;
    if (!creditedAccountId)
        return res.status(400)
            .json({
            message: 'Favor enviar o identificador da conta para crédito',
        });
    if (creditedAccountId === token.id ||
        creditedAccountId === debitedAccountId) {
        return res.status(400).json({
            message: 'Não é possível creditar para a própria conta.',
        });
    }
    const { value } = transaction;
    if (!value)
        return res.status(400)
            .json({
            message: 'Favor enviar o valor para transferir',
        });
    if (value <= 0)
        return res.status(400)
            .json({ message: 'O valor (value) da transferência deve ser maior que 0.00' });
    if (!debitAccount.balance)
        return res.status(400)
            .json({ message: 'Formato inválido, falta campo balance.' });
    if (value > debitAccount.balance)
        return res.status(400)
            .json({ message: 'Saldo insuficiente.' });
    next();
});
exports.default = validateTransactions;
