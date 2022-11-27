import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import GetUser from '../../helpers/GetUser';
import GetUsersList from '../../helpers/GetUsersList';
import GetUserTransactions from '../../helpers/GetUserTransactions';
import nookies from 'nookies';
import { useRequests } from '../../api-services/requests';
import { useRouter } from 'next/router';

const Users = () => {
  const api = useRequests();
  const router = useRouter();
  const { id } = router.query;

  const {
    user,
    token,
    usersList,
    transactions,
    setContextToken,
    setContextUser,
    error
  } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (id) {
      const tokenValidate = async () => {
        const { token } = nookies.get();

        if (token) {
          const data = await api.requestToken(
            '/validate',
            token
          );
          if (data) setContextToken(token);
        }
      };
      tokenValidate();
  
      GetUser(Number(id)).then(response => setContextUser(response))
        .catch(error => console.log(error));
  
      GetUserTransactions(Number(id)).then(response => console.log(response))
        .catch(error => console.log(error));
  
      GetUsersList().then(response => console.log(response))
        .catch(error => console.log({
          message: error?.response?.data?.message,
          status: error?.response?.status,
        }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);


  useEffect(() => {}, [api]);

  const filterUsersList = () => {
    if (usersList && usersList?.length > 0) {
      const filtered = usersList.filter((user) => {
        if (user.username?.toLowerCase().includes(searchTerm)) return user;
      });
      return filtered;
    }
  };

  return (
    <>
      <div>
      {
          (token)
          ?
          <>
            <p>Boas vindas à sua conta, {user?.username}</p>
            <p>Seu saldo é de $ {user?.account?.balance}</p>
          </>
          :
          (error && error.message)
          ?
          <p>Erro: {error.status} - {error.message}</p>
          :
          false
      }
      </div>
      <div>
        {
          (error && error.message)
          ?
          <p>{error.message}</p>
          :
          false
        }
      </div>
      <div>
        <form>
          <label htmlFor="searchName">Buscar por nome: </label>
          <input
            type="search"
            name=""
            id="searchName"
            onChange={event => {
              setSearchTerm(event.target.value)
              filterUsersList()
            }}
          />
        </form>
      </div>
    </>
  );
};

export default Users;