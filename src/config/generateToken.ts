import jwt from "jsonwebtoken";

const generateToken = (username: string) => {
  return jwt.sign({ username }, String(process.env.JWT_SECRET), {
    expiresIn: "3d",
  });
};

export default generateToken;
