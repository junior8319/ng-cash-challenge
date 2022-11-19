import { NextFunction, Request, Response } from 'express';
import ITransaction from '../interfaces/ITransaction';
import TransactionsService from '../services/Transactions.service';

class TransactionsController {
  public service: TransactionsService;

  public transaction!: ITransaction;

  public id!: number;

  constructor() {
    this.service = new TransactionsService();
  }

  public getTransactions = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const transactionsList: ITransaction[] | null = await this.service
        .getTransactions();
      
      if (!transactionsList || transactionsList.length === 0) return res
        .status(400).json({
          message: 'Não encontramos transações cadastradas.',
      });

      return res.status(200).json(transactionsList);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  public createTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.transaction = req.body;
      
      const newTransaction: ITransaction | null = await this
        .service.createTransaction(this.transaction);
      if(!newTransaction) return res.status(400)
        .json({ message: 'Não foi possível cadastrar esta transação.' });

      return res.status(201).json(newTransaction);      
    } catch (error) {
      console.log(error)
      next(error);
    }
  };

  public deleteTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400)
        .json({
          message: 'Por favor, nos passe um identificador(id) para excluir.',
        });
      
      this.id = Number(id);
      const transactionToDelete = await this.service.deleteTransaction(this.id);
      if (!transactionToDelete) return res.status(404)
        .json({
          message: `Não encontramos pessoa usuária com o id ${this.id}`,
        });
      
      return res.status(202).json({ message: 'Registro excluído com sucesso.' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default new TransactionsController();
