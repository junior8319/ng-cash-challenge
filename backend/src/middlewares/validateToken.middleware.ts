import { NextFunction, Request, Response } from 'express';
import jwtGenerator from '../helpers/jwtGenerator';

const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401)
    .json({ message: 'Token não encontrado.' });

  const isValidToken = await jwtGenerator.verify(authorization); 

  if (!isValidToken) return res.status(401)
    .json({ message: 'Token inválido.' });
  
  next();
};

export default validateToken;
