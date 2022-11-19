import AccountModel from '../database/models/Account.model';
import UserModel from '../database/models/User.model';
import IAccount from '../interfaces/IAccount';


class AccountsService {
  static model: IAccount;

  public id!: number;

  public balance!: number;

  constructor() {
    AccountsService.model = new AccountModel();
  }

  public getAccounts = async (): Promise<IAccount[] | null> => {
    const accountsList = await AccountModel.findAll(
      {
        include: [
          { model: UserModel, as: 'user', attributes: { exclude: ['id', 'password'] } },
        ],
      }
    );
    if (!accountsList) return null;

    return accountsList;
  };

  public createAccount = async (receivedAccount: IAccount): Promise<IAccount | null> => {
    if (!receivedAccount) return null;

    const newAccount = await AccountModel.create({ ...receivedAccount });
    return newAccount.dataValues;
  };

  public creditToAccount = async (receivedValue: number, receivedId: number): Promise<IAccount | null> => {
    if (!receivedValue || receivedValue <= 0 || !receivedId) return null;

    this.id = receivedId;
    const accountToCredit = await AccountModel.findByPk(this.id);
    if (!accountToCredit) return null;

    this.balance = accountToCredit.balance + receivedValue;
    await accountToCredit.update({ balance: this.balance });

    return accountToCredit;
  };

  public debitToAccount = async (receivedValue: number, receivedId: number): Promise<IAccount | null> => {
    if (!receivedValue || receivedValue <= 0 || !receivedId) return null;

    this.id = receivedId;
    const accountToDebit = await AccountModel.findByPk(this.id);
    if (!accountToDebit) return null;

    if (accountToDebit.balance < receivedValue) return null;

    this.balance = accountToDebit.balance - receivedValue;
    await accountToDebit.update({ balance: this.balance });

    return accountToDebit;
  };

  public deleteAccount = async (receivedId: string): Promise<IAccount | null> => {
    if (!receivedId) return null;

    this.id = Number(receivedId);

    const accountToDelete = await AccountModel.findByPk(this.id);
    if (!accountToDelete) return null;

    await accountToDelete.destroy();

    return accountToDelete;
  };
}

export default AccountsService;
