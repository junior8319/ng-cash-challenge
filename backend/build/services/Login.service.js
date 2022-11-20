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
class Login {
    constructor() {
        this.getUser = (user) => __awaiter(this, void 0, void 0, function* () {
            const { username } = user;
            if (!username)
                return null;
            Login.username = username;
            const userData = yield User_model_1.default.findOne({
                where: { username: Login.username },
                attributes: { exclude: ['password'] },
            });
            if (!userData)
                return null;
            return { user: userData.dataValues };
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
            });
            if (!userData)
                return null;
            delete userData.dataValues.password;
            return userData.dataValues;
        });
        Login.model = new User_model_1.default();
    }
}
exports.default = Login;
