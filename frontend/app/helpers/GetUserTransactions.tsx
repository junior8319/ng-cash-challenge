import { useRequests } from "../api-services/requests";
import nookies from 'nookies';

const GetUserTransactions = async (id: number) => {
  const api = useRequests();
  const { token } = nookies.get();

  const transactions = await api.requestData(
    `/transactions/${id}`,
    token,
  );
  return transactions;
};

export default GetUserTransactions;
