import UserModel from '../database/models/User.model';
import IUserLogin, { ILogin } from "../interfaces/ILogin";
import Jwt from '../helpers/jwtGenerator';
import md5 from 'md5';
import AccountModel from '../database/models/Account.model';
import UsersService from './Users.service';

class Login {
  static service: UsersService;
  
  static username: string;

  constructor() {
    Login.service = new UsersService();
  }

  public getUser = async (user: IUserLogin): Promise<ILogin | null> => {
    const { username } = user;
    if (!username) return null;

    Login.username = username;
    const response = await Login.service.getUserByName(Login.username);
    if (!response || !response.id) return null;
    
    const userData = await Login.service.getUserById(response.id, response.id);
    if (!userData) return null;
    
    const userToReturn = {
      id: userData.id,
      username: userData.username,
      accountId: userData.accountid,
      account: {
        balance: userData?.account?.balance,
      },
    };

    return { user: userToReturn };
  };

  public generateToken = async (user: IUserLogin): Promise<ILogin | null> => {
    const userData = await this.getUser(user);
    if (!userData) return null;

    const token = await Jwt.generate({
      id: userData.user.id,
      username: userData.user.username,
    });

    if (!token) return null;

    return { user: userData.user, token };
  };

  public login = async (user: IUserLogin): Promise<ILogin | null> => {
    if (!user) return null
    const hashedPassword = md5(user.password);

    const userData = await UserModel.findOne({
      where: {
        username: user.username,
        password: hashedPassword,
      },
      include: [
        { model: AccountModel, as: 'account' },
      ],
      attributes: { exclude: ['password'] },
    });

    if (!userData) return null;
    
    delete userData.dataValues.password;

    const userLoggedData = await this.generateToken(userData.dataValues);
    if (!userLoggedData) return null;

    return userLoggedData;
  };
}

export default Login;
