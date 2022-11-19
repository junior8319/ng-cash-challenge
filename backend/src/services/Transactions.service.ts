import ITransaction from '../interfaces/ITransaction';
import TransactionModel from '../database/models/Transaction.model';
import AccountModel from '../database/models/Account.model';
import AccountsService from './Accounts.service';


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

  public getTransactions = async (): Promise<ITransaction[] | null> => {
    const transactions = await TransactionModel.findAll(
      {
        include: [
          { model: AccountModel, as: 'debited from' },
          { model: AccountModel, as: 'credited to' },
        ],
      }
    );
    if (!transactions) return null;

    return transactions;
  };

  public createTransaction = async (
    receivedTransaction: ITransaction): Promise<ITransaction | null> => {
    const { debitedAccountId, creditedAccountId } = receivedTransaction;
    if (!debitedAccountId || !creditedAccountId) return null;
    if (debitedAccountId === creditedAccountId) return null;
    
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
