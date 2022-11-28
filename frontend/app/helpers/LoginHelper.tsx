import { AxiosError } from "axios";
import { setCookie } from "nookies";
import { useRequests } from "../api-services/requests";
import ILoginUser from '../interfaces/ILoginsUser';

const LoginHelper = async (user: ILoginUser) => {
  try {
    const api = useRequests();
    const response = await api.requestLogin(
      '/login',
      {
        username: user.username,
        password: user.password
      }
    );

    if (response.user && response.token) {
      setCookie(undefined, 'token', response.token, {
        maxAge: 60 * 60 * 24 // 24 horas de duração
      });
      return {user: response.user, token: response.token};
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

export default LoginHelper;
