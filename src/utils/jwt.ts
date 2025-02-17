import jwt, { SignOptions } from "jsonwebtoken";

class JwtHandler {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  signToken(payload: object, options?: SignOptions): string {
    return jwt.sign(payload, this.secret, options || {});
  }

  verifyToken(token: string): object | string {
    return jwt.verify(token, this.secret);
  }

  decodeToken(token: string): object | string | null {
    return jwt.decode(token);
  }
}

export default JwtHandler;
