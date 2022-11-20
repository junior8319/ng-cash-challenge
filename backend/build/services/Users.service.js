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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const md5_1 = __importDefault(require("md5"));
const Account_model_1 = __importDefault(require("../database/models/Account.model"));
const User_model_1 = __importDefault(require("../database/models/User.model"));
const Accounts_service_1 = __importDefault(require("./Accounts.service"));
class UsersService {
    constructor() {
        this.getUsers = () => __awaiter(this, void 0, void 0, function* () {
            const usersList = yield User_model_1.default.findAll({
                include: [
                    { model: Account_model_1.default, as: 'account', attributes: { exclude: ['id'] } },
                ],
                attributes: { exclude: ['password'] },
            });
            if (!usersList)
                return null;
            return usersList;
        });
        this.createUser = (receivedUser) => __awaiter(this, void 0, void 0, function* () {
            if (!receivedUser)
                return null;
            const accountToCreate = {
                balance: 100.00,
            };
            this.username = receivedUser.username;
            this.password = (0, md5_1.default)(receivedUser.password);
            const userExists = yield UsersService.userExists(this.username);
            if (userExists)
                return null;
            const newAccount = yield UsersService.accountService.createAccount(Object.assign({}, accountToCreate));
            if (!newAccount || !newAccount.id)
                return null;
            this.accountid = newAccount.id;
            const newUser = yield User_model_1.default.create(Object.assign(Object.assign({}, receivedUser), { accountid: this.accountid }));
            if (!newUser)
                return null;
            delete newUser.dataValues.password;
            return newUser.dataValues;
        });
        this.updateUser = (receivedUser) => __awaiter(this, void 0, void 0, function* () {
            if (!receivedUser || !receivedUser.id)
                return null;
            this.id = receivedUser.id;
            const userToUpdate = yield User_model_1.default.findByPk(this.id);
            if (!userToUpdate)
                return null;
            if (receivedUser.username) {
                this.username = receivedUser.username;
                const alreadyExists = yield UsersService.userExists(this.username);
                if (alreadyExists)
                    return null;
                yield userToUpdate.update({ username: receivedUser.username });
            }
            if (receivedUser.password) {
                yield userToUpdate.update({ password: (0, md5_1.default)(receivedUser.password) });
            }
            return userToUpdate;
        });
        this.deleteUser = (receivedId) => __awaiter(this, void 0, void 0, function* () {
            if (!receivedId)
                return null;
            this.id = receivedId;
            const userToDelete = yield User_model_1.default.findByPk(this.id);
            if (!userToDelete)
                return null;
            yield userToDelete.destroy();
            return userToDelete;
        });
        UsersService.model = new User_model_1.default();
        UsersService.accountService = new Accounts_service_1.default();
    }
}
_a = UsersService;
UsersService.userExists = (receivedUserName) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_model_1.default.findOne({
        where: { username: receivedUserName },
    });
    const exists = !!user;
    return exists;
});
exports.default = UsersService;
