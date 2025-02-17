class User {
  userID: number;
  userName?: string;
  userAge?: number;
  userPassword?: string;

  constructor(
    userID: number,
    userName?: string,
    userAge?: number,
    userPassword?: string
  ) {
    this.userID = userID;
    this.userName = userName;
    this.userAge = userAge;
    this.userPassword = userPassword;
  }
}

export default User;
