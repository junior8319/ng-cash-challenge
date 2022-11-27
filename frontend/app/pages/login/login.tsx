import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

const Login = () => {
  const { user, login, handleChange } = useContext(UserContext);
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const response = await login(user);
    return response;
  };

  return (
    <div>
      <h1>Login</h1>
      <form>
        <div>
          <label htmlFor="username">Nome de Pessoa Usuária:</label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={ (event) => handleChange(event) }
            value={user?.username}
          />
        </div>
        <div>
          <label htmlFor="username">Senha:</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={ (event) => handleChange(event) }
            value={user?.password}
          />
        </div>
          
      </form>
      <div>
        <button
          type='button'
          onClick={ (event) => handleSubmit(event) }
        >
          Login
        </button>
        <button
          type='button'
          onClick={ () => {
            router.push('/users/register')
          } }
        >
          Cadastrar
        </button>
      </div>
    </div>
  )
};

export default Login;
