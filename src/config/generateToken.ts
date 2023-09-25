import jwt from "jsonwebtoken";

const generateToken = (username: string) => {
  return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

export default generateToken;
