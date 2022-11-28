import { useRequests } from "../api-services/requests";
import nookies from 'nookies';

const GetUsersList = async () => {
  const api = useRequests();
  const { token } = nookies.get();
  const usersList = await api.requestData(
    '/users',
    token,
  );
  return usersList;
};

export default GetUsersList;
