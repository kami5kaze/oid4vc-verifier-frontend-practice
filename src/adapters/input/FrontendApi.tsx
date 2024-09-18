import { Context, Handler, Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { setCookie, getCookie } from 'hono/cookie';
import { jsxRenderer } from 'hono/jsx-renderer';
import { Env } from '../../di/env';
import { Template } from './views/template';
import { Home } from './views/home';
import { Init } from './views/init';
import { Result } from './views/result';
import { InitTransactionRequest } from '../../domain/InitTransactionRequest';
import { getDI } from './getDI';
import { URLBuilder } from '../../utils/URLBuilder';
import { ErrorPage } from './views/error';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { GetWalletResponseRequest } from '../../domain/GetWalletResponseRequest';
import { presentationDefinition } from '../../data/mDL';
import { v4 as uuidv4 } from 'uuid';

export class FrontendApi {
  #home: string;
  #init: string;
  #result: string;

  constructor(homePath: string, initPath: string, resultPath: string) {
    this.#home = homePath;
    this.#init = initPath;
    this.#result = resultPath;
  }

  get route(): Hono<Env> {
    const app = new Hono<Env>()
      .use(
        '*',
        jsxRenderer(({ children }) => <Template>{children}</Template>)
      )
      .get(this.#home, this.homeHandler())
      .get(this.#init, this.initHandler())
      .get(this.#result, this.resultHandler())
      .get('*', this.notFoundHandler());
    return app;
  }

  homeHandler(): Handler<Env> {
    return (c) => c.render(<Home initTransactionPath={this.#init} />);
  }

  initHandler(): Handler<Env> {
    return async (c) => {
      try {
        const { portsIn } = getDI(c);
        const initTransaction = portsIn.initTransaction;
        const { sessionId, response } = await initTransaction(
          InitTransactionRequest.fromJSON({
            type: 'vp_token',
            presentation_definition: presentationDefinition(uuidv4()),
            nonce: uuidv4(),
            wallet_response_redirect_uri_template:
              'http://localhost:8787/result?response_code={RESPONSE_CODE}',
            // new URLBuilder({
            //   baseUrl: 'http://localhost:8787',
            //   path: '/result',
            //   queryBuilder: new QueryBuilder({
            //     response_code: '{RESPONSE_CODE}',
            //   }),
            // }).build(),
          })
        );
        setCookie(c, 'sessionId', sessionId, {
          path: '/',
          httpOnly: true,
          // secure: true,
          sameSite: 'Lax',
          maxAge: 60 * 60 * 24 * 7,
        });
        const redirectUrl = new URLBuilder({
          baseUrl: c.env.WALLET_URL,
          queryBuilder: new QueryBuilder({
            ...response.toWalletRedirectParams(),
          }),
        }).build();

        return c.render(
          <Init redirectUrl={redirectUrl} homePath={this.#home} />
        );
      } catch (error) {
        return this.handleError(c, (error as Error).message);
      }
    };
  }

  resultHandler(): Handler<Env> {
    return async (c) => {
      try {
        const { portsIn, portsOut } = getDI(c);
        const getWalletResponse = portsIn.getWalletResponse;
        const responseCode = c.req.query('response_code');
        const sessionId = getCookie(c, 'sessionId');
        if (!sessionId) {
          throw new HTTPException(400, {
            message: 'session expired, please try again',
          });
        }
        const presentationId = await portsOut.loadPresentationId(sessionId);
        if (!presentationId) {
          throw new HTTPException(400, {
            message: 'session expired, please try again',
          });
        }
        const response = await getWalletResponse(
          new GetWalletResponseRequest(responseCode),
          presentationId
        );
        return c.render(<Result response={response} homePath={this.#home} />);
      } catch (error) {
        return this.handleError(c, (error as Error).message);
      }
    };
  }

  notFoundHandler(): Handler<Env> {
    return (c) => {
      c.status(404);
      return c.render(
        <ErrorPage error="Page Not Found" homePath={this.#home} />
      );
    };
  }

  handleError(c: Context<Env>, error: string): Response | Promise<Response> {
    return c.render(<ErrorPage error={error} homePath={this.#home} />);
  }
}
