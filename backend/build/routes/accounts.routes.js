"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Accounts_controller_1 = __importDefault(require("../controllers/Accounts.controller"));
const error_middleware_1 = __importDefault(require("../middlewares/error.middleware"));
const validateToken_middleware_1 = __importDefault(require("../middlewares/validateToken.middleware"));
const accountsRouter = (0, express_1.Router)();
accountsRouter.get('/accounts', validateToken_middleware_1.default, Accounts_controller_1.default.getAccounts, error_middleware_1.default.handleErrors);
exports.default = accountsRouter;
