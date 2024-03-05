import secrets from "../constants/secrets.const";
import jwt from "jsonwebtoken";

class JWT {
  private decode = () => {
    const deocodedSecret = Buffer.from(secrets.jwtSecret, "base64").toString("ascii");
    return deocodedSecret;
  };

  public sign = async (userId: number) => {
    const token = await jwt.sign({ userId }, this.decode(), { expiresIn: "30d" });

    return token;
  };

  public verify = async <T = { userId: number }>(token: string) => {
    const payload = await jwt.verify(token, this.decode());

    return payload as T;
  };
}

const jwtHelper = new JWT();

export default jwtHelper;
