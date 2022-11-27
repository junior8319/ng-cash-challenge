export default interface ILoginUser {
  id?: number;
  username?: string;
  password?: string;
  account?: {
    balance?: number;
  };
}
