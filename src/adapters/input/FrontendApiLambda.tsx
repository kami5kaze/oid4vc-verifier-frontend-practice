import { decode, Tag } from 'cbor-x';
import { Context, Handler, Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { jsxRenderer } from 'hono/jsx-renderer';
import { StatusCode } from 'hono/utils/http-status';
import { MdocCbor } from 'mdoc-cbor-ts';
import { toString } from 'qrcode';
import { UAParser } from 'ua-parser-js';
import { v4 as uuidv4 } from 'uuid';
import { presentationDefinition } from '../../data/mDL';
import { Env, Bindings } from '../../env';
import { InitTransactionRequest } from '../../ports/input';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { URLBuilder } from '../../utils/URLBuilder';
import { getLambdaDI } from './getLambdaDI';
import { ErrorPage, Home, Init, Result, Template } from './views';
import { ApiGatewayRequestContextV2 } from 'hono/aws-lambda';

interface LambdaEnv {
  Bindings: Bindings & {
    event: {
      requestContext: ApiGatewayRequestContextV2;
    };
  };
}
/**
 * Frontend API class
 */
export class FrontendApiLambda {
  #home: string;
  #init: string;
  #result: string;

  /**
   * Constructor of the class
   * @param {string} homePath - The home path
   * @param {string} initPath - The init path
   * @param {string} resultPath - The result path
   */
  constructor(homePath: string, initPath: string, resultPath: string) {
    this.#home = homePath;
    this.#init = initPath;
    this.#result = resultPath;
  }

  /**
   * Api Routes
   */
  get route(): Hono<LambdaEnv> {
    const app = new Hono<LambdaEnv>()
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

  /**
   * Handler for home path
   * @returns {Handler<LambdaEnv>} The handler
   */
  homeHandler(): Handler<LambdaEnv> {
    return (c) => c.render(<Home initTransactionPath={this.#init} />);
  }

  /**
   * Handler for init path
   * @returns {Handler<LambdaEnv>} The handler
   */
  initHandler(): Handler<LambdaEnv> {
    return async (c) => {
      try {
        const stage = c.env.event.requestContext.stage;
        const { portsIn, config } = getLambdaDI(c);
        const initTransaction = portsIn.initTransaction;

        console.log('config :>> ', config);

        const ua = new UAParser(c.req.raw.headers.get('user-agent') || '');
        const device = ua.getDevice().type;
        const { sessionId, response } = await initTransaction(
          // TODO - Implement function to generate InitTransaction Request parameters
          InitTransactionRequest.fromJSON({
            type: 'vp_token',
            presentation_definition: presentationDefinition(uuidv4()),
            nonce: uuidv4(),
            wallet_response_redirect_uri_template:
              device === 'mobile'
                ? decodeURIComponent(
                    new URLBuilder({
                      baseUrl: config.publicUrl,
                      path: config.resultPath,
                      queryBuilder: new QueryBuilder({
                        response_code: '{RESPONSE_CODE}',
                      }),
                    }).build()
                  )
                : undefined,
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
          baseUrl: config.walletUrl,
          queryBuilder: new QueryBuilder({
            ...response.toWalletRedirectParams(),
          }),
        }).build();
        const qr = await toString(redirectUrl);
        if (device === 'mobile') {
          return c.render(
            <Init
              redirectUrl={redirectUrl}
              homePath={'/' + stage + this.#home}
            />
          );
        }
        return c.render(
          <Init
            redirectUrl={redirectUrl}
            homePath={'/' + stage + this.#home}
            qr={qr}
            resultPath={'/' + stage + this.#result}
          />
        );
      } catch (error) {
        return this.handleError(c, (error as Error).message);
      }
    };
  }

  /**
   * Handler for result path
   * @returns {Handler<LambdaEnv>} The handler
   */
  resultHandler(): Handler<LambdaEnv> {
    return async (c) => {
      try {
        const { portsIn } = getLambdaDI(c);
        const getWalletResponse = portsIn.getWalletResponse;
        const responseCode = c.req.query('response_code');
        const sessionId = getCookie(c, 'sessionId');
        if (!sessionId) {
          throw new HTTPException(400, {
            message: 'session expired, please try again',
          });
        }
        const response = await getWalletResponse(sessionId, responseCode);
        const verifier = new MdocCbor();
        if (!response.vpToken) {
          // TODO - Error messege
          throw new Error('VP token not presented');
        }
        verifier.loadBase64Url(response.vpToken);
        if (!(await verifier.verify())) {
          // TODO - Error messege
          throw new Error('Invalid VP token');
        }
        const data: Record<string, Record<string, unknown>>[] | undefined =
          response.presentationSubmission?.descriptorMaps.flatMap(
            (descriptorMap) => {
              return verifier.documents
                .filter((v) => v.docType === descriptorMap.id.value)
                .map((v) => {
                  return {
                    [descriptorMap.id.value]: Object.values(
                      v.issuerSigned.nameSpaces
                    ).reduce<Record<string, unknown>>((acc, tags) => {
                      tags.forEach(({ value }) => {
                        const { elementValue, elementIdentifier } =
                          decode(value);
                        acc[elementIdentifier as string] =
                          elementValue instanceof Tag
                            ? elementValue.value
                            : elementValue;
                      });
                      return acc;
                    }, {}),
                  };
                });
            }
          );

        return c.render(
          <Result
            data={data}
            vpToken={response.vpToken}
            homePath={this.#home}
          />
        );
      } catch (error) {
        return this.handleError(c, (error as Error).message);
      }
    };
  }

  /**
   * Handler for invalid path
   * @returns {Handler<LambdaEnv>} The handler
   */
  notFoundHandler(): Handler<LambdaEnv> {
    return (c) => {
      c.status(404);
      return c.render(
        <ErrorPage error="Page Not Found" homePath={this.#home} />
      );
    };
  }

  /**
   * Handle error
   * @param {Context<LambdaEnv>} c - The context
   * @param {string} error - The error message
   * @returns {Response | Promise<Response>} The response
   */
  handleError(
    c: Context<LambdaEnv>,
    error: string,
    status?: StatusCode
  ): Response | Promise<Response> {
    c.status(status || 500);
    return c.render(<ErrorPage error={error} homePath={this.#home} />);
  }
}
