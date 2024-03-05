import express from "express";
import cors from "cors";
import helmet from "helmet";
import secrets from "./constants/secrets.const";
import { Environments } from "./schema/enums/env.enum";
import path from "path";
import YAML from "yamljs";
import swagger from "swagger-ui-express";
import { errorHandler } from "./helpers/error.helper";
import routes from "./routes";

const app = express();

const isProd = secrets.nodeEnv === Environments.PRODUCTION;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

app.use(cors());
app.use(helmet());

const docPath = path.join(__dirname, isProd ? "../docs" : "./docs", "v1.yaml");
const doc = YAML.load(docPath);
app.use("/api/v1/doc", swagger.serve, swagger.setup(doc));
app.get("/", (req, res) => res.redirect("/api/v1/doc"));
app.use("/api/v1/doc", routes);

app.use(errorHandler);
app.all("*", (_, res) => res.status(404).send("Route does not exist"));

export default app;
