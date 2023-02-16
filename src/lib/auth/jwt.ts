import createHttpError from "http-errors"
import { RequestHandler, Request } from "express"
import { verifyAccessToken } from "./tools"
import { TokenPayload } from "./tools"

interface UserRequest extends Request {
  user?: TokenPayload
}

export const JWTAuthMiddleware: RequestHandler = async (req: UserRequest, res, next) => {
  // 1. Check if authorization header is in the request, if it is not --> 401
  if (!req.headers.authorization) {
    next(createHttpError(401, "Please provide Bearer Token in the authorization header!"))
  } else {
    try {
      // 2. If authorization header is there, we should extract the token from it
      // ("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA5ZTJiMGViLTczY2QtNGIzZC1iZGMxLTk3MWJmZWE5Yzc0MyIsInJ1b2xvIjoiVXNlciIsImlhdCI6MTY3Mzk3NjIzMywiZXhwIjoxNjc0NTgxMDMzfQ.WGA-F9D_WeO96SJ2MzamSemg-emLjHv_N8_hYx3ipIw")
      const accessToken = req.headers.authorization.replace("Bearer ", "")

      // 3. Verify token (check the integrity and check expiration date)
      const payload = await verifyAccessToken(accessToken)

      // 4. If everything is fine we should get back the payload and no errors --> next
      req.user = {
        _id: payload._id,
        role: payload.role,
      }
      next()
    } catch (error) {
      console.log(error)
      // 5. If token is NOT ok, or in any case jsonwebtoken will throw some error --> 401
      next(createHttpError(401, "Token not valid!"))
    }
  }
}
