export default interface IUser {
  id: number;
  username: string;
  password: string;
  accountid?: number;
  account?: {
    balance?: number;
  };
}