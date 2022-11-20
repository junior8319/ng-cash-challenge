import { Router } from "express";
import AccountsController from "../controllers/Accounts.controller";
import errorMiddleware from "../middlewares/error.middleware";
import validateToken from "../middlewares/validateToken.middleware";

const accountsRouter = Router();

accountsRouter.get(
  '/accounts',
  validateToken,
  AccountsController.getAccounts,
  errorMiddleware.handleErrors
);

export default accountsRouter;
