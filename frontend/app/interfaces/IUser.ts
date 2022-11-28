export default interface IUser {
  id?: number;
  username?: string;
  password?: string;
  accountId?: number;
  status?: string;
  message?: string;
  account?: {
    balance?: number;
  };
}
