import { Hono } from "hono";
import { FrontendApi } from "./adapters/input/FrontendApi";
import { HonoConfiguration } from "./di/HonoConfiguration";

const configuration = new HonoConfiguration();
const api = new FrontendApi(
  configuration.homePath,
  configuration.initPath,
  configuration.resultPath,
  configuration.switchbotPath,
  configuration.controllerPath
);

const app = new Hono()
  .get("/", (c) => c.redirect(configuration.homePath))
  .route("/", api.route);

export default app;
