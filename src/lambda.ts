import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { FrontendApiLambda } from './adapters/input/FrontendApiLambda';
import { HonoConfiguration } from './di/HonoConfiguration';
import { setupLambdaMiddleware } from './middleware/setup';

const configuration = new HonoConfiguration();
const api = new FrontendApiLambda(
  configuration.homePath,
  configuration.initPath,
  configuration.resultPath,
  configuration.switchbotPath
);

const app = new Hono()
  .use(setupLambdaMiddleware)
  .get('/', (c) => c.redirect(configuration.homePath))
  .route('/', api.route);

// export default app;
export const handler = handle(app);
