import db from "../config/database";
import User from "../models/userModel";

class UserRepository {
  async createUser(user: Omit<User, "userID">): Promise<number> {
    const { userName, userAge, userPassword } = user;
    const [result]: any = await db.raw(
      "INSERT INTO users (userName, userAge, userPassword) VALUES (?, ?, ?)",
      [userName, userAge, userPassword]
    );
    return result.insertId; // Return the generated userID
  }

  async findUserById(userID: number): Promise<User | null> {
    const [rows]: any = await db.raw("SELECT * FROM users WHERE userID = ?", [
      userID,
    ]);
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
    const [result]: any = await db.raw(
      "UPDATE users SET userName = ?, userAge = ?, userPassword = ? WHERE userID = ?",
      [userName, userAge, userPassword, userID]
    );
    return result.affectedRows > 0;
  }

  async deleteUser(userID: number): Promise<boolean> {
    const [result]: any = await db.raw("DELETE FROM users WHERE userID = ?", [
      userID,
    ]);
    return result.affectedRows > 0;
  }
}

export default new UserRepository();
