import UserModel from '../database/models/User.model';
import IUserLogin, { ILogin } from "../interfaces/ILogin";
import Jwt from '../helpers/jwtGenerator';
import md5 from 'md5';

class Login {
  static model: UserModel;
  
  static username: string;

  constructor() {
    Login.model = new UserModel();
  }

  public getUser = async (user: IUserLogin): Promise<ILogin | null> => {
    const { username } = user;
    if (!username) return null;

    Login.username = username;
    const userData = await UserModel.findOne({
      where: { username: Login.username },
      attributes: { exclude: ['password'] },
    });

    if (!userData) return null;

    return { user: userData.dataValues };
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
    });

    if (!userData) return null;

    delete userData.dataValues.password;

    return userData.dataValues;
  };
}

export default Login;
