import { useRequests } from "../api-services/requests";
import nookies from 'nookies';

const GetUser = async (id: number) => {
  const api = useRequests();
  const { token } = nookies.get();

  const user = await api.requestData(
    `/users/${id}`,
    token,
  );
  return user;
};

export default GetUser;
