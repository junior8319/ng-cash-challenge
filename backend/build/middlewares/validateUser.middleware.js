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
const Users_service_1 = __importDefault(require("../services/Users.service"));
const validateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    const VALID_USERNAME_LENGTH = 3;
    const VALID_PASSWORD = (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9]{8,}/g);
    if (!user.username || !user.password) {
        return res.status(400).json({
            message: 'Informe username e password para fazer login'
        });
    }
    const isValidUserName = user.username.length >= VALID_USERNAME_LENGTH;
    const isValidPassword = VALID_PASSWORD.test(user.password);
    if (!isValidUserName) {
        return res.status(401).json({
            message: 'Informe um username com pelo menos 3 caracteres.',
        });
    }
    if (!isValidPassword) {
        return res.status(401).json({
            message: 'Informe uma senha com ao menos 8 caracteres, sendo ao' +
                ' menos 1 letra maiúscula e 1 número',
        });
    }
    const userServices = new Users_service_1.default();
    const userExists = yield userServices.getUserByName(user.username);
    if (userExists)
        return res.status(400)
            .json({ message: `Já existe pessoa usuária cadastrada com username: ${user.username}` });
    next();
});
exports.default = validateUser;
