import { Router } from "express";
import TransactionsController from "../controllers/Transactions.controller";
import errorMiddleware from "../middlewares/error.middleware";

const transactionsRouter = Router();

transactionsRouter.get(
  '/transactions',
  TransactionsController.getTransactions,
  errorMiddleware.handleErrors,
);

transactionsRouter.post(
  '/transactions',
  TransactionsController.createTransaction,
  errorMiddleware.handleErrors,
);

transactionsRouter.delete(
  '/transactions/:id',
  TransactionsController.deleteTransaction,
  errorMiddleware.handleErrors,
);

export default transactionsRouter;
