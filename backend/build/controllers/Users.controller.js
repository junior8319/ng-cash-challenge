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
const jwtGenerator_1 = __importDefault(require("../helpers/jwtGenerator"));
class UsersController {
    constructor() {
        this.jwt = jwtGenerator_1.default;
        this.getUsers = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const usersList = yield this.service.getUsers();
                if (!usersList || usersList.length === 0)
                    return res.status(400)
                        .json({ message: 'Não encontramos pessoas usuárias cadastradas.' });
                return res.status(200).json(usersList);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
        this.createUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.user = req.body;
                const newUser = yield this.service.createUser(this.user);
                if (!newUser)
                    return res.status(400).json({
                        message: `Não foi possível cadastrar pessoa usuária.`,
                    });
                const token = yield jwtGenerator_1.default.generate(newUser);
                if (!token)
                    return res.status(400)
                        .json({ message: 'Não foi possível criar um token.' });
                return res.status(201).json({ user: newUser, token });
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
        this.updateUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id || !req.body)
                    return res.status(400)
                        .json({ message: 'Sem dado para atualizar' });
                const user = Object.assign(Object.assign({}, req.body), { id });
                const updatedUser = yield this.service.updateUser(user);
                if (!updatedUser)
                    return res.status(403)
                        .json({
                        message: 'Não foi possível alterar, provavelmente este nome de ' +
                            'pessoa usuária já está cadastrado.'
                    });
                return res.status(200).json(updatedUser);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
        this.deleteUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id)
                    return res.status(400)
                        .json({
                        message: 'Por favor, nos passe um identificador(id) para excluir.',
                    });
                this.id = Number(id);
                const userDeleted = yield this.service.deleteUser(this.id);
                if (!userDeleted)
                    return res.status(404)
                        .json({ message: `Não encontramos usuário com o id ${id}` });
                return res.status(202).json({ message: 'Registro excluído com sucesso' });
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
        this.service = new Users_service_1.default();
    }
}
exports.default = new UsersController();
