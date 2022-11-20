import { NextFunction, Request, Response } from 'express';

const validateUser = async (req: Request, res: Response, next: NextFunction) => {
  const username = req.body;

  if (
    !username ||
    username.length === 0 ||
    Object.keys(req.body).length === 0) {
    return res.status(400).json(
      {
        message: 'Informe um nome (username) de pessoa usuária para buscarmos.'
      },
    );
  }
  
  next();
};

export default validateUser;
