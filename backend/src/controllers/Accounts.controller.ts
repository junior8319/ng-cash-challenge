import { NextFunction, Request, Response } from 'express';
import IAccount from '../interfaces/IAccount';
import AccountsService from '../services/Accounts.service';

class AccountsController {
  public service: AccountsService;

  constructor() {
    this.service = new AccountsService();
  }

  public getAccounts = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const accountsList: IAccount[] | null = await this.service.getAccounts();
      
      if (!accountsList || accountsList.length === 0) return res.status(400)
        .json({ message: 'Não encontramos contas cadastradas.' });

      return res.status(200).json(accountsList);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default new AccountsController();
