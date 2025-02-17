import db from "../config/database";
import User from "../models/userModel";

class UserRepository {
  private database;

  constructor() {
    this.database = db("users");
  }

  async createUser(user: Omit<User, "userID">): Promise<number> {
    const { userName, userAge, userPassword } = user;
    const result: any = await this.database.insert({
      userName,
      userAge,
      userPassword,
    });
    return result[0]; // MySQL returns the insertId
  }

  async findUserById(userID: number): Promise<User | null> {
    const rows: any = await this.database
      .select("*")
      .from("users")
      .where({ userID });
    if (rows.length === 0) return null;
    return new User(
      rows[0].userID,
      rows[0].userName,
      rows[0].userAge,
      rows[0].userPassword
    );
  }

  async updateUser(userID: number, userData: Partial<User>): Promise<boolean> {
    const { userName, userAge, userPassword } = userData;
    const result: any = await this.database
      .where({ userID })
      .update({ userName, userAge, userPassword });
    return result > 0;
  }

  async deleteUser(userID: number): Promise<boolean> {
    const result: any = await this.database.where({ userID }).del();
    return result > 0;
  }

  async getUserByUserName(username: string): Promise<User | null> {
    const rows = await this.database
      .select("*")
      .from("users")
      .where({ userName: username });

    if (!rows || rows.length === 0) return null;

    const user = rows[0];
    return new User(
      user.userID,
      user.userName,
      user.userAge,
      user.userPassword
    );
  }
}

export default UserRepository;
