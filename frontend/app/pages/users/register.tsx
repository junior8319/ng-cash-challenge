import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";

const Register = () => {
  const { user, token, response, register, handleChange } = useContext(UserContext);
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const response = await register(user)
    return response;
  };

  return (
    <div>
      <h1>Cadastrar</h1>
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
        { (response?.status)
          ?
          <div>
            <p>Falha na validação:</p>
            <p>Status: { response.status }</p>
            <p>Mensagem: { response.message }</p>
          </div>
          :
          false
        }
      </div>
      <div>
        <button
          type='button'
          onClick={ (event) => handleSubmit(event) }
        >
          Cadastrar
        </button>
      </div>
    </div>
  )
};

export default Register;
