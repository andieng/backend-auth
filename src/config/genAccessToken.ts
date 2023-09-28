import jwt from "jsonwebtoken";

const genAccessToken = (username: string) => {
  return jwt.sign({ username }, String(process.env.JWT_SECRET), {
    expiresIn: "1d",
  });
};

export default genAccessToken;
