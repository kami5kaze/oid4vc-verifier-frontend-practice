import { Context, Handler, Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { jsxRenderer } from 'hono/jsx-renderer';
import { StatusCode } from 'hono/utils/http-status';
import { MdocVerifyHandlerImpl, mdlSchema } from 'mdoc-cbor-ts';
import { toString } from 'qrcode';
import { UAParser } from 'ua-parser-js';
import { v4 as uuidv4 } from 'uuid';
import { presentationDefinition } from '../../data';
import { Env } from '../../env';
import { InitTransactionRequest } from '../../ports/input';
import { getTimestamp, hmacMatch } from '../../switchbot/hmac';
import { getDevicesData } from '../../switchbot/switchbot_api';
import { controlDevices } from '../../switchbot/switchbot_controller';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { URLBuilder } from '../../utils/URLBuilder';
import { getDI } from './getDI';
import { Device, ErrorPage, Home, Init, Result, Switchbot, Template } from './views';

/**
 * Frontend API class
 */
export class FrontendApi {
  #home: string;
  #init: string;
  #result: string;
  #switchbot: string;
  #controller: string;
  /**
   * Constructor of the class
   * @param {string} homePath - The home path
   * @param {string} initPath - The init path
   * @param {string} resultPath - The result path
   * @param {string} switchbotPath - The switchbot path
   * @param {string} controllerPath - The controller path
   */
  constructor(homePath: string, initPath: string, resultPath: string, switchbotPath: string , controllerPath: string) {
    this.#home = homePath;
    this.#init = initPath;
    this.#result = resultPath;
    this.#switchbot = switchbotPath;
    this.#controller = controllerPath;
  }

  /**
   * Api Routes
   */
  get route(): Hono<Env> {
    const app = new Hono<Env>()
      .use(
        '*',
        jsxRenderer(({ children }) => <Template>{children}</Template>)
      )
      .get(this.#home, this.homeHandler())
      .get(this.#init, this.initHandler())
      .get(this.#result, this.resultHandler())
      .get(this.#switchbot, this.switchbotHandler())
      .post(this.#controller, this.controllerHandler())
      .get('*', this.notFoundHandler());
    return app;
  }

  /**
   * Handler for home path
   * @returns {Handler<Env>} The handler
   */
  homeHandler(): Handler<Env> {
    return async (c) => {
      try {
        const { config } = getDI(c);
        const nonce = c.req.query('nonce');
        const hmac = c.req.query('hmac');
        const [ts_past, ts_now] = getTimestamp(1);
        let comutedHmac: Boolean = false;

        if (!nonce) return this.handleError(c, 'Missing query parameter: nonce', 400);
        if (!hmac) return this.handleError(c, 'Missing query parameter: hmac', 400);

        const data_past = Buffer.from(`${ts_past}:${nonce}`, 'utf-8');
        const data_now = Buffer.from(`${ts_now}:${nonce}`, 'utf-8');

        try {
          comutedHmac = await hmacMatch(config, data_past, data_now , hmac);
        } catch (e) {
          console.error('hmacMatch error:', e);
          return this.handleError(c, 'HMAC verification error', 400);
        }

        console.log('HMAC Check:', comutedHmac);
        if (!comutedHmac) {
          return this.handleError(c, 'HMAC validation failed', 403);
        }
        return c.render(<Home initTransactionPath={this.#init} />);
      } catch (error) {
        return this.handleError(c, (error as Error).message);
      }
    }
  }

  /**
   * Handler for init path
   * @returns {Handler<Env>} The handler
   */
  initHandler(): Handler<Env> {
    return async (c) => {
      try {
        const { portsIn, config } = getDI(c);
        const initTransaction = portsIn.initTransaction;

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
            <Init redirectUrl={redirectUrl} homePath={this.#home} />
          );
        }
        return c.render(
          <Init
            redirectUrl={redirectUrl}
            homePath={this.#home}
            qr={qr}
            resultPath={this.#result}
          />
        );
      } catch (error) {
        return this.handleError(c, (error as Error).message);
      }
    };
  }

  /**
   * Handler for result path
   * @returns {Handler<Env>} The handler
   */
  resultHandler(): Handler<Env> {
    return async (c) => {
      try {
        const { portsIn } = getDI(c);
        const getWalletResponse = portsIn.getWalletResponse;
        const responseCode = c.req.query('response_code');
        const sessionId = getCookie(c, 'sessionId');
        console.log("sessionId in resultHandler: ", sessionId);
        console.log("responseCode in resultHandler: ", responseCode);
        if (!sessionId) {
          throw new HTTPException(400, {
            message: 'session expired, please try again',
          });
        }
        const response = await getWalletResponse(sessionId, responseCode);
        console.log("Wallet Response:", response);
        const verifier = new MdocVerifyHandlerImpl({
          'org.iso.18013.5.1': mdlSchema,
        });
        if (!response.vpToken) {
          // TODO - Error messege
          throw new Error('VP token not presented');
        }
        const result = await verifier.verify(response.vpToken);
        if (!result.valid) {
          // TODO - Error messege
          throw new Error('Invalid VP token');
        }
        // TODO - sessionIDの名前をどうするか
        setCookie(c, 'sessionId_2', uuidv4(), {
          path: '/',
          httpOnly: true,
          // secure: true,
          sameSite: 'Lax',
          maxAge: 60 * 60,
        });
        const data = Object.entries(result.documents).map(([_, v]) => v);
        return c.render(
          <Result
            data={data}
            vpToken={response.vpToken}
            homePath={this.#switchbot}
          />
        );
      } catch (error) {
        return this.handleError(c, (error as Error).message);
      }
    };
  }

  //result後にswitchbotのwebにアクセスするためのhandlerを追加
  /**
   * Handler for switchbot path
   * @returns {Handler<Env>} The handler
   */
  switchbotHandler(): Handler<Env> {
    return async (c) => {
      try {
        const { config } = getDI(c);
        const sessionId = getCookie(c, 'sessionId');
        if (!sessionId) {
          throw new HTTPException(400, {
            message: 'session expired, please try again',
          });
        }

        const ua = new UAParser(c.req.raw.headers.get('user-agent') || '');
        const device = ua.getDevice().type;
        const data = await getDevicesData(config);
        const devicesList: Device[] = data.body.deviceList;
        const smartLocks = devicesList.filter(device => device.deviceType.toLowerCase() === "smart lock");
        if (device === 'mobile') {
          return c.render(
            <Switchbot devices={smartLocks}  homePath={this.#home} />
          );
        }
        return c.render(
          <Switchbot
            devices={smartLocks}
            homePath={this.#home}
          />
        );
      } catch (error) {
        return this.handleError(c, (error as Error).message);
      }
    };
  }

  /**
   * Handler for switchbot path
   * @returns {Handler<Env>} The handler
   */
  controllerHandler(): Handler<Env> {
    return async (c) => {
      try {
        const { config } = getDI(c);
        const body = await c.req.parseBody();
        const deviceId = body.deviceId.toString();
        if (!deviceId) {
          return c.json({ status: 400, message: "Bad Request: Missing deviceName" }, 400);
        }
        
        const resp = await controlDevices(config, deviceId);
        
        return resp;
      } catch (e: any) {
        console.error("Error controlling device:", e);
        return Response.json({ ok: false, error: String(e) }, { status: 500 });
      }
    };
  }


  /**
   * Handler for invalid path
   * @returns {Handler<Env>} The handler
   */
  notFoundHandler(): Handler<Env> {
    return (c) => {
      c.status(404);
      return c.render(
        <ErrorPage error="Page Not Found" homePath={this.#home} />
      );
    };
  }

  /**
   * Handle error
   * @param {Context<Env>} c - The context
   * @param {string} error - The error message
   * @returns {Response | Promise<Response>} The response
   */
  handleError(
    c: Context<Env>,
    error: string,
    status?: StatusCode
  ): Response | Promise<Response> {
    c.status(status || 500);
    return c.render(<ErrorPage error={error} homePath={this.#home} />);
  }
}
