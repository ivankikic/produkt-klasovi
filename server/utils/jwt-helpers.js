import jwt from "jsonwebtoken";

function jwtTokens(user) {
  let userPayload = { ...user };

  delete userPayload.exp;

  const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
}

export { jwtTokens };
