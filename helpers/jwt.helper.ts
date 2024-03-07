import secrets from "../constants/secrets.const";
import jwt from "jsonwebtoken";
import ServiceException from "../schema/exceptions/service.exception";

class JWT {
  private decode = () => {
    const deocodedSecret = Buffer.from(secrets.jwtSecret, "base64").toString("ascii");
    return deocodedSecret;
  };

  public sign = async (userId: number) => {
    const token = await jwt.sign({ userId }, this.decode(), { expiresIn: "30d" });

    return token;
  };

  public verify = async <T = { userId: string }>(token: string) => {
    try {
      const payload = await jwt.verify(token, this.decode());

      return payload as T;
    } catch (error: any) {
      throw new ServiceException(401, error.message || error);
    }
  };
}

const jwtHelper = new JWT();

export default jwtHelper;
