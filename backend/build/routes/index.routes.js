"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRouter = exports.transactionsRouter = exports.accountsRouter = exports.usersRouter = void 0;
const users_routes_1 = __importDefault(require("./users.routes"));
exports.usersRouter = users_routes_1.default;
const accounts_routes_1 = __importDefault(require("./accounts.routes"));
exports.accountsRouter = accounts_routes_1.default;
const transactions_routes_1 = __importDefault(require("./transactions.routes"));
exports.transactionsRouter = transactions_routes_1.default;
const login_routes_1 = __importDefault(require("./login.routes"));
exports.loginRouter = login_routes_1.default;
