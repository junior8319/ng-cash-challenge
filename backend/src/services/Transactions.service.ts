import ITransaction from '../interfaces/ITransaction';
import TransactionModel from '../database/models/Transaction.model';
import AccountModel from '../database/models/Account.model';
import AccountsService from './Accounts.service';
import { Op } from 'sequelize';


class TransactionsService {
  static model: ITransaction;

  static accountsService: AccountsService;

  public id!: number;

  public debitedAccountId!: number;

  public creditedAccountId!: number;

  public value!: number;

  constructor() {
    TransactionsService.model = new TransactionModel();
    TransactionsService.accountsService = new AccountsService();
  }

  public getTransactions = async (tokenId: number): Promise<ITransaction[] | null> => {
    const debits = await TransactionModel.findAll(
      {
        where: { debitedAccountId: tokenId },
        include: [
          { model: AccountModel, as: 'debited from' },
          { model: AccountModel, as: 'credited to', attributes: { exclude: ['balance'] }},
        ],
      }
    );

    const credits = await TransactionModel.findAll(
      {
        where: { creditedAccountId: tokenId },
        include: [
          { model: AccountModel, as: 'debited from', attributes: { exclude: ['balance'] } },
          { model: AccountModel, as: 'credited to'},
        ],
      }
    );

    const transactions = [...debits, ...credits]

    if (!transactions) return null;

    return transactions;
  };

  public createTransaction = async (
    receivedTransaction: ITransaction,
    tokenId: number,    
  ): Promise<ITransaction | null> => {
    const { debitedAccountId, creditedAccountId } = receivedTransaction;
    if (!debitedAccountId || !creditedAccountId) return null;
    if (debitedAccountId === creditedAccountId) return null;
    if (debitedAccountId !== tokenId) return null;
    
    const newTransaction = await TransactionModel
      .create({ ...receivedTransaction });
    if (!newTransaction) return null;

    await TransactionsService.accountsService
      .debitToAccount(newTransaction.value, newTransaction.debitedAccountId);
    
    await TransactionsService.accountsService
      .creditToAccount(newTransaction.value, newTransaction.creditedAccountId);

    return newTransaction.dataValues;
  };

  static undoTransaction = async (receivedTransaction: ITransaction): Promise<void | null> => {
    const { value, creditedAccountId, debitedAccountId } = receivedTransaction;
    if (
      !receivedTransaction ||
      !value ||
      !creditedAccountId ||
      !debitedAccountId) {
      return null;
    }

    await TransactionsService.accountsService
      .debitToAccount(value, creditedAccountId);

    await TransactionsService.accountsService
      .creditToAccount(value, debitedAccountId);
  };

  public deleteTransaction = async (receivedId: number): Promise<ITransaction | null> => {
    if (!receivedId) return null;

    this.id = receivedId;
    const transactionToDelete = await TransactionModel.findByPk(this.id);
    if (!transactionToDelete) return null;
    
    await TransactionsService.undoTransaction(transactionToDelete);

    await transactionToDelete.destroy();

    return transactionToDelete;
  };
}

export default TransactionsService;
