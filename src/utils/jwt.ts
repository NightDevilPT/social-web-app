import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export function generateToken(payload: object, expiresIn = "7d") {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET_KEY);
}
