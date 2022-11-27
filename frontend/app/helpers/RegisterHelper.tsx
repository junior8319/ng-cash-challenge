import { setCookie } from "nookies";
import IUser from "../interfaces/IUser";
import { useRequests } from '../api-services/requests';
import { AxiosError } from "axios";

const RegisterHelper = async (user: IUser): Promise<any> => {
  try {
    const api = useRequests();
    const response = await api.requestRegisterUser(
      '/users',
      {
        username: user.username,
        password: user.password,
      }
    );

    if (response.user && response.token) {
      setCookie(undefined, 'token', response.token, {
        maxAge: 60 * 60 * 24 // 24 horas de duração
      });
      return { user: response.user, token: response.token };
    }
  } catch (error: AxiosError | any) {
    if (error.response.status && error.response.data.message) {
      const returnError = {
        status: error.response.status,
        message: error.response.data.message
      };
      return returnError;
    }
    console.log(error);
    return error;
  }
};

export default RegisterHelper;