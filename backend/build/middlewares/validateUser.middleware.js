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
Object.defineProperty(exports, "__esModule", { value: true });
const validateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body;
    if (!username ||
        username.length === 0 ||
        Object.keys(req.body).length === 0) {
        return res.status(400).json({
            message: 'Informe um nome (username) de pessoa usuária para buscarmos.'
        });
    }
    next();
});
exports.default = validateUser;
