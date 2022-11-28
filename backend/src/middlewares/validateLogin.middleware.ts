import { NextFunction, Request, Response } from 'express';
import IUser from '../interfaces/IUser';
import LoginService from '../services/Login.service';
import UsersService from '../services/Users.service';

const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
  const user: IUser = req.body;
  const VALID_USERNAME_LENGTH = 3;
  const VALID_PASSWORD = (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9]{8,}/g);

  if (!user.username || !user.password) {
    return res.status(400).json({
      message: 'Informe username e password para fazer login' });
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

  const userServices = new UsersService();

  const userExists = await userServices.getUserByName(user.username);
  if (!userExists) return res.status(404)
    .json({ message: 'Pessoa usuária não encontrada' });

  const loginServices = new LoginService();
  const dataMatch = await loginServices.login(user);
  if (!dataMatch) return res.status(403)
    .json({ message: 'Senha não confere, favor tentar novamente.' });

  next();
};

export default validateLogin;
