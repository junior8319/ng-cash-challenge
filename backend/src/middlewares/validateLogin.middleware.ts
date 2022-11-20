import { NextFunction, Request, Response } from 'express';
import IUser from '../interfaces/IUser';

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
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

  next();
};

export default validateLogin;
