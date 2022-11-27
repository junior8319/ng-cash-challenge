import IUser from "./IUser";
import ILoginUser from './ILoginsUser';
import IUserLogin from '../../../backend/src/interfaces/ILogin';
import IError from './IError';

export default interface IUserContext {
  user?: IUser | ILoginUser;
  isLogged?: boolean;
  response?: {
    user?: {
      id?: number;
      username?: string
      accountId?: number;
      balance?: number;
    };
    status?: string;
    message?: string;
    token?: string;
  };
  error?: IError;
  token?: string;
  transactions?: {};
  usersList?: IUser[];
  setContextToken: (token: string) => void;
  setContextUser: (user: IUser) => void;
  register: (event: any) => Promise<IUser | IUserLogin | IError>;
  login: (event: any) => Promise<IUser | IUserLogin | IError>;
  handleChange: (event: any) => void;
}
