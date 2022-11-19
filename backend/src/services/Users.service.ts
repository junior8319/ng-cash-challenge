import AccountModel from "../database/models/Account.model";
import UserModel from "../database/models/User.model";
import IAccount from "../interfaces/IAccount";
import IUser from "../interfaces/IUser";
import AccountsService from "./Accounts.service";


class UsersService {
  static model: IUser;

  static accountService: AccountsService;

  public id!: number;

  public username!: string;

  public cpf!: string;

  public accountid!: number;

  constructor() {
    UsersService.model = new UserModel();
    UsersService.accountService = new AccountsService();
  }

  public getUsers = async (): Promise<IUser[] | null> => {
    const usersList = await UserModel.findAll(
      {
        include: [
          { model: AccountModel, as: 'account', attributes: { exclude: ['id'] } },
        ],
        attributes: { exclude: ['password'] },
      }
    );
    if (!usersList) return null;

    return usersList;
  };

  static userExists = async (receivedUserName: string): Promise<boolean> => {
    const user = await UserModel.findOne({
      where: { username: receivedUserName },
    });

    const exists = !!user;

    return exists;
  };

  public createUser = async (receivedUser: IUser): Promise<IUser | null> => {
    if (!receivedUser) return null;

    const accountToCreate = {
      balance: 100.00,
    };

    this.username = receivedUser.username;
    const userExists = await UsersService.userExists(this.username);
    if (userExists) return null;

    const newAccount = await UsersService.accountService.createAccount({ ...accountToCreate })
    if (!newAccount || !newAccount.id) return null;
    this.accountid = newAccount.id;

    const newUser = await UserModel.create({ ...receivedUser, accountid: this.accountid });
    if (!newUser) return null;
    
    return newUser.dataValues;
  };

  public updateUser = async (receivedUser: IUser): Promise<IUser | null> => {
    if (!receivedUser || !receivedUser.id) return null;

    this.id = receivedUser.id;

    const userToUpdate = await UserModel.findByPk(this.id);
    if (!userToUpdate) return null;
    console.log(userToUpdate);

    if (receivedUser.username) {
      this.username = receivedUser.username;
      
      const alreadyExists = await UsersService.userExists(this.username);
      if (alreadyExists) return null;
      console.log(alreadyExists);

      await userToUpdate.update({ username: receivedUser.username });
    }

    if (receivedUser.password) {
      await userToUpdate.update({ password: receivedUser.password });
    }

    return userToUpdate;
  };

  public deleteUser = async (receivedId: number): Promise<IUser | null> => {
    if (!receivedId) return null;

    this.id = receivedId;

    const userToDelete = await UserModel.findByPk(this.id);
    if (!userToDelete) return null;

    await userToDelete.destroy();

    return userToDelete;
  };
}

export default UsersService;
