import { Data, renderFile } from "ejs";
import { join } from "path";
import secrets from "../constants/secrets.const";
import { Environments } from "../schema/enums/env.enum";

const isProd = secrets.nodeEnv === Environments.PRODUCTION;

export function renderTemplate<P extends Data>(filename: string, data: P): string {
  let html = "";

  const filePath = join(__dirname, isProd ? "../../templates" : "../templates", filename);

  renderFile(filePath, data, (err, string) => {
    if (err) {
      // throw exception
    }
    html = string;
  });

  return html;
}
