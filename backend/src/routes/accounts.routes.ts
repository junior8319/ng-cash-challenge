import { Router } from "express";
import AccountsController from "../controllers/Accounts.controller";
import errorMiddleware from "../middlewares/error.middleware";

const accountsRouter = Router();

accountsRouter.get(
  '/accounts',
  AccountsController.getAccounts,
  errorMiddleware.handleErrors
);

export default accountsRouter;
