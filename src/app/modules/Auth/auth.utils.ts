import jwt, { JwtPayload } from 'jsonwebtoken'

export const createToken = (
  jwtPayload: { userId: string; role: string },
  secret: string,
  expiresIn: any,
) => {
  return jwt.sign(jwtPayload, secret as string, {
    expiresIn,
  })
}

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload
}
