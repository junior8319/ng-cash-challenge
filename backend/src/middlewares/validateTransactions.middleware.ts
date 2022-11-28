import { NextFunction, Request, Response } from 'express';
import jwtGenerator from '../helpers/jwtGenerator';
import AccountsService from '../services/Accounts.service';

const validateTransactions = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401)
    .json({ message: 'Token não encontrado.' });

  const token = await jwtGenerator.verify(authorization);
  if (!token) return res.status(401)
    .json({ message: 'Token inválido.' });

  const transaction = req.body;

  const accountsService = new AccountsService();
  
  if (!transaction || Object.keys(transaction).length === 0) return res.status(400)
    .json({
      message: `Favor enviar uma transação válida
      no formato de objeto:
      {
        "debitedAccountId": <numérico inteiro>,
        "creditedAccountId": <numérico inteiro>,
        "value": <numérico com 2 casas decimais>
      }`
    });
    
  const { debitedAccountId } = transaction;
  if (!debitedAccountId) return res.status(400)
    .json({
      message: 'Favor enviar o identificador da conta para débito',
    });
  const debitAccount = await accountsService.getAccountById(debitedAccountId, token.id);
  if (!debitAccount) return res.status(404).json({
    message: 'Não foi possível encontrar conta para débito.'
  });
  
  if (debitedAccountId !== token.id) return res.status(400)
    .json({
      message: 'Você não pode debitar de uma conta que não seja a sua.'
    });
  
  const { creditedAccountId } = transaction;
  if (!creditedAccountId) return res.status(400)
    .json({
      message: 'Favor enviar o identificador da conta para crédito',
    });
  
  if (
    creditedAccountId === token.id ||
    creditedAccountId === debitedAccountId)
  {
    return res.status(400).json({
      message: 'Não é possível creditar para a própria conta.',
    });
  }

  const { value } = transaction;
  if (!value) return res.status(400)
    .json({
      message: 'Favor enviar o valor para transferir',
    });
  
  if (value <= 0) return res.status(400)
    .json({ message: 'O valor (value) da transferência deve ser maior que 0.00' });
  
  if (!debitAccount.balance) return res.status(400)
    .json({ message: 'Formato inválido, falta campo balance.' });
  
  if (value > debitAccount.balance) return res.status(400)
    .json({ message: 'Saldo insuficiente.' });
  
  next();
};

export default validateTransactions;
