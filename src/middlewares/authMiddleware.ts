import jwt from "jsonwebtoken";
import app from "../app";

const authMiddleware = (req: any) => {
  let token: string;
  let isAuthenticated = false;
  if (req?.headers?.authorization) {
    token = req.headers.authorization;
    if (token) {
      const decoded: any = jwt.verify(token, String(process.env.JWT_SECRET));
      const user = app.db.find(decoded?.username);
      req.user = user;
      isAuthenticated = true;
    }
  }
  return isAuthenticated;
};

export default authMiddleware;
