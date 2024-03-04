import { Data, renderFile } from "ejs";
import { join } from "path";
import secrets from "../constants/secrets.const";
import { Environments } from "../schema/enums/env.enum";
import ServiceException from "../schema/exceptions/service.exception";

const isProd = secrets.nodeEnv === Environments.PRODUCTION;

export function renderTemplate<P extends Data>(filename: string, data: P): string {
  let html = "";

  const filePath = join(__dirname, isProd ? "../../templates" : "../templates", filename);

  renderFile(filePath, data, (err, string) => {
    if (err) {
      throw new ServiceException(400, "unable to read email template");
    }
    html = string;
  });

  return html;
}
