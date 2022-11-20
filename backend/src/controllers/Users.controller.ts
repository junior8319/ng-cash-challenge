import { NextFunction, Request, Response } from 'express';
import IUser from '../interfaces/IUser';
import UsersService from '../services/Users.service';
import JwtGenerator from '../helpers/jwtGenerator';

class UsersController {
  public service: UsersService;

  public jwt = JwtGenerator;

  public user!: IUser;

  public id!: number;

  constructor() {
    this.service = new UsersService();
  }

  public getUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const usersList: IUser[] | null = await this.service.getUsers();
      
      if (!usersList || usersList.length === 0) return res.status(400)
        .json({ message: 'Não encontramos pessoas usuárias cadastradas.' });

      return res.status(200).json(usersList);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.user = req.body;

      const newUser: IUser | null = await this.service.createUser(this.user);
      if (!newUser) return res.status(400).json({
        message: `Não foi possível cadastrar pessoa usuária.`,
      });

      const token = await JwtGenerator.generate(newUser);
      if (!token) return res.status(400)
        .json({ message: 'Não foi possível criar um token.' });

      return res.status(201).json({ user: newUser, token });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id || !req.body) return res.status(400)
        .json({ message: 'Sem dado para atualizar' });
      
      const user = { ...req.body, id };
      
      const updatedUser = await this.service.updateUser(user);
      if (!updatedUser) return res.status(403)
        .json({
          message: 'Não foi possível alterar, provavelmente este nome de ' +
            'pessoa usuária já está cadastrado.'
        });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400)
        .json({
          message: 'Por favor, nos passe um identificador(id) para excluir.',
        });
      
      this.id = Number(id);
      const userDeleted = await this.service.deleteUser(this.id);
      if(!userDeleted) return res.status(404)
        .json({ message: `Não encontramos usuário com o id ${id}` });

      return res.status(202).json({ message: 'Registro excluído com sucesso' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default new UsersController();
