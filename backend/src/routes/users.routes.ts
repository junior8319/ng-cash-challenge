import { Router } from "express";
import UsersController from "../controllers/Users.controller";
import errorMiddleware from "../middlewares/error.middleware";

const usersRouter = Router();

usersRouter.get(
  '/users',
  UsersController.getUsers,
  errorMiddleware.handleErrors
);

usersRouter.post(
  '/users',
  UsersController.createUser,
  errorMiddleware.handleErrors,
);

usersRouter.put(
  '/users/:id',
  UsersController.updateUser,
  errorMiddleware.handleErrors,
);

usersRouter.delete(
  '/users/:id',
  UsersController.deleteUser,
  errorMiddleware.handleErrors,
);

export default usersRouter;
