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
const User_model_1 = __importDefault(require("../database/models/User.model"));
const jwtGenerator_1 = __importDefault(require("../helpers/jwtGenerator"));
const md5_1 = __importDefault(require("md5"));
const Account_model_1 = __importDefault(require("../database/models/Account.model"));
const Users_service_1 = __importDefault(require("./Users.service"));
class Login {
    constructor() {
        this.getUser = (user) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { username } = user;
            if (!username)
                return null;
            Login.username = username;
            const response = yield Login.service.getUserByName(Login.username);
            if (!response || !response.id)
                return null;
            const userData = yield Login.service.getUserById(response.id, response.id);
            if (!userData)
                return null;
            const userToReturn = {
                id: userData.id,
                username: userData.username,
                accountId: userData.accountid,
                account: {
                    balance: (_a = userData === null || userData === void 0 ? void 0 : userData.account) === null || _a === void 0 ? void 0 : _a.balance,
                },
            };
            return { user: userToReturn };
        });
        this.generateToken = (user) => __awaiter(this, void 0, void 0, function* () {
            const userData = yield this.getUser(user);
            if (!userData)
                return null;
            const token = yield jwtGenerator_1.default.generate({
                id: userData.user.id,
                username: userData.user.username,
            });
            if (!token)
                return null;
            return { user: userData.user, token };
        });
        this.login = (user) => __awaiter(this, void 0, void 0, function* () {
            if (!user)
                return null;
            const hashedPassword = (0, md5_1.default)(user.password);
            const userData = yield User_model_1.default.findOne({
                where: {
                    username: user.username,
                    password: hashedPassword,
                },
                include: [
                    { model: Account_model_1.default, as: 'account', attributes: { exclude: ['balance'] } },
                ],
                attributes: { exclude: ['password'] },
            });
            if (!userData)
                return null;
            delete userData.dataValues.password;
            const userLoggedData = yield this.generateToken(userData.dataValues);
            if (!userLoggedData)
                return null;
            return userLoggedData;
        });
        Login.service = new Users_service_1.default();
    }
}
exports.default = Login;
