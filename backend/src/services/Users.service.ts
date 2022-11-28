import md5 from 'md5';
import AccountModel from "../database/models/Account.model";
import UserModel from "../database/models/User.model";
import IUser from "../interfaces/IUser";
import AccountsService from "./Accounts.service";


class UsersService {
  static model: IUser;

  static accountService: AccountsService;

  public id!: number;

  public username!: string;

  public password!: string;

  public accountid!: number;

  constructor() {
    UsersService.model = new UserModel();
    UsersService.accountService = new AccountsService();
  }

  public getUsers = async (): Promise<IUser[] | null> => {
    const usersList = await UserModel.findAll(
      {
        attributes: { exclude: ['password'] },
      }
    );
    if (!usersList) return null;

    return usersList;
  };
  
  public getUserById = async (receivedId: number, tokenId: number): Promise<IUser | null> => {
    if (!receivedId) return null;
    this.id = receivedId;

    if (this.id !== tokenId) {
      const user = await UserModel.findOne(
        {
          where: { id: this.id },
          include: [
            { model: AccountModel, as: 'account', attributes: { exclude: ['id', 'balance'] } },
          ],
          attributes: { exclude: ['password'] },
        }
      );
      if (!user) return null;
  
      return user;  
    }

    const user = await UserModel.findOne(
      {
        where: { id: this.id },
        include: [
          { model: AccountModel, as: 'account', attributes: { exclude: ['id'] } },
        ],
        attributes: { exclude: ['password'] },
      }
    );
    if (!user) return null;

    return user.dataValues;
  };

  public getUserByName = async (receivedName: string): Promise<IUser | null> => {
    if (!receivedName) return null;
    this.username = receivedName;

    const user = await UserModel.findOne(
      {
        where: { username: this.username },
        include: [
          { model: AccountModel, as: 'account', attributes: { exclude: ['balance'] } },
        ],
        attributes: { exclude: ['password'] },
      }
    );
    if (!user) return null;

    return user.dataValues;
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
    this.password = md5(receivedUser.password);
    const userExists = await UsersService.userExists(this.username);
    if (userExists) return null;

    const newAccount = await UsersService.accountService.createAccount({ ...accountToCreate })
    if (!newAccount || !newAccount.id) return null;
    this.accountid = newAccount.id;

    const newUser = await UserModel.create({ ...receivedUser, password: this.password, accountid: this.accountid });
    if (!newUser) return null;
    
    delete newUser.dataValues.password;
    const dataToReturn = {
      id: newUser.dataValues.id,
      username: newUser.dataValues.username,
      accountid: newUser.dataValues.accountid,
      password: '',
      account: {
        balance: newAccount.balance,
      }
    };

    return dataToReturn;
  };

  public updateUser = async (receivedUser: IUser): Promise<IUser | null> => {
    if (!receivedUser || !receivedUser.id) return null;

    this.id = receivedUser.id;

    const userToUpdate = await UserModel.findByPk(this.id);
    if (!userToUpdate) return null;

    if (receivedUser.username) {
      this.username = receivedUser.username;
      
      const alreadyExists = await UsersService.userExists(this.username);
      if (alreadyExists) return null;

      await userToUpdate.update({ username: receivedUser.username });
    }

    if (receivedUser.password) {
      await userToUpdate.update({ password: md5(receivedUser.password) });
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
