"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Transactions_controller_1 = __importDefault(require("../controllers/Transactions.controller"));
const error_middleware_1 = __importDefault(require("../middlewares/error.middleware"));
const validateToken_middleware_1 = __importDefault(require("../middlewares/validateToken.middleware"));
const transactionsRouter = (0, express_1.Router)();
transactionsRouter.get('/transactions', validateToken_middleware_1.default, Transactions_controller_1.default.getTransactions, error_middleware_1.default.handleErrors);
transactionsRouter.post('/transactions', validateToken_middleware_1.default, Transactions_controller_1.default.createTransaction, error_middleware_1.default.handleErrors);
transactionsRouter.delete('/transactions/:id', validateToken_middleware_1.default, Transactions_controller_1.default.deleteTransaction, error_middleware_1.default.handleErrors);
exports.default = transactionsRouter;
