import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
interface JwtPayload {
  userId: number;
}
interface AuthRequest extends Request {
  userId?: number;
}
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Invalid token format",
    });
  }
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string,
  ) as JwtPayload;
  req.userId = decoded.userId;
  next();
};
