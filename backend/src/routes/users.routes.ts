import { Router } from "express";
import UsersController from "../controllers/Users.controller";
import errorMiddleware from "../middlewares/error.middleware";
import validateToken from "../middlewares/validateToken.middleware";

const usersRouter = Router();

usersRouter.get(
  '/users',
  validateToken,
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
  validateToken,
  UsersController.updateUser,
  errorMiddleware.handleErrors,
);

usersRouter.delete(
  '/users/:id',
  validateToken,
  UsersController.deleteUser,
  errorMiddleware.handleErrors,
);

export default usersRouter;
