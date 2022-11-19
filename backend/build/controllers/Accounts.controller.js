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
const Accounts_service_1 = __importDefault(require("../services/Accounts.service"));
class AccountsController {
    constructor() {
        this.getAccounts = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const accountsList = yield this.service.getAccounts();
                if (!accountsList || accountsList.length === 0)
                    return res.status(400)
                        .json({ message: 'Não encontramos contas cadastradas.' });
                return res.status(200).json(accountsList);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
        this.service = new Accounts_service_1.default();
    }
}
exports.default = new AccountsController();
