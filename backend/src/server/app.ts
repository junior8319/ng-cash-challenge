import express, { json, NextFunction, Request, Response } from 'express';
import {
  accountsRouter,
  loginRouter,
  transactionsRouter,
  usersRouter
} from '../routes/index.routes';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();
    this.config();
    this.app.use(usersRouter);
    this.app.use(accountsRouter);
    this.app.use(transactionsRouter);
    this.app.use(loginRouter);
    this.middlewares();

    this.app.get('/', (_req, res) => res.send('Hello, World!'));
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);
    this.app.use(express.json());
  }

  middlewares = () => {
    this.app.use(json());
  };

  listen = (port: number) => {
    this.app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
  };
}

export default new App();
