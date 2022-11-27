import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';
import LoginHelper from '../helpers/LoginHelper';
import RegisterHelper from '../helpers/RegisterHelper';
import IError from '../interfaces/IError';
import IProps from '../interfaces/IProps';
import IUser from '../interfaces/IUser';
import IUserContext from '../interfaces/IUserContext';
import { useRequests } from '../api-services/requests';

export const UserContext = createContext({} as IUserContext);

export const UserProvider = ({ children }: IProps) => {
  const router = useRouter();
  const api = useRequests();

  const [user, setUser] = useState<IUser> ({ username: '', password: '' });
  const [error, setError] = useState<IError>({ status: '', message: '' });
  const [transactions, setTransactions] = useState([]);
  const [usersList, setUsersList] = useState<IUser[]>([]);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [response, setResponse] = useState<IError | IUser | IUserContext>({ status: '', message: '' });
  const [token, setToken] = useState<string>('');


  const register = async (user: IUser): Promise<any> => {
    const response = await RegisterHelper(user);
    setResponse(response);
    if (response.user) {
      setIsLogged(true);
      setUser(response.user);
      setToken(response.token);
      router.push(`/users/${response.user.id}`);
    }
  };

  const login = async (receivedUser: IUser): Promise<any> => {
    const response = await LoginHelper(receivedUser);
    setResponse(response);
    if (response.user) {
      setIsLogged(true);
      setUser(response.user);
      setToken(response.token);
      router.push(`/users/${response?.user?.id}`)
    }
  };

  const setContextToken = (receivedToken: string): void => {
    setToken(receivedToken);
  };

  const setContextUser = (receivedUser: IUser): void => {
    setUser(receivedUser);
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setUser(
      {
        ...user,
        [name]: value,
      }
    );
  };

  const contextValues: IUserContext = {
    user,
    isLogged,
    response,
    error,
    transactions,
    usersList,
    token,
    setContextToken,
    setContextUser,
    register,
    login,
    handleChange,
  };

  return (
    <UserContext.Provider value={ contextValues }>
      {children}
    </UserContext.Provider>
  );
};
