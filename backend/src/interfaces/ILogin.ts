export default interface IUserLogin {
  username: string;
  password: string;
}

export interface ILogin {
  user: {
    id: number,
    username: string;
    password?: string;
    accountid?: number;
  },
  token?: string;
}