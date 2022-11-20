import { Router } from "express";
import TransactionsController from "../controllers/Transactions.controller";
import errorMiddleware from "../middlewares/error.middleware";
import validateToken from '../middlewares/validateToken.middleware';

const transactionsRouter = Router();

transactionsRouter.get(
  '/transactions',
  validateToken,
  TransactionsController.getTransactions,
  errorMiddleware.handleErrors,
);

transactionsRouter.post(
  '/transactions',
  validateToken,
  TransactionsController.createTransaction,
  errorMiddleware.handleErrors,
);

transactionsRouter.delete(
  '/transactions/:id',
  validateToken,
  TransactionsController.deleteTransaction,
  errorMiddleware.handleErrors,
);

export default transactionsRouter;
