import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { FrontendApiLambda } from './adapters/input/FrontendApiLambda';
import { HonoConfiguration } from './di/HonoConfiguration';

const configuration = new HonoConfiguration();
const api = new FrontendApiLambda(
  configuration.homePath,
  configuration.initPath,
  configuration.resultPath
);

const app = new Hono()
  .get('/', (c) => c.redirect(configuration.homePath))
  .route('/', api.route);

// export default app;
export const handler = handle(app);
