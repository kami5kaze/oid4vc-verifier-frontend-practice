import { Context } from 'hono';
import { HonoConfiguration, PortsInImpl, LambdaPortsOutImpl } from '../../di';

export const getLambdaDI = (c: Context) => {
  const config = new HonoConfiguration(c);
  const portsOut = new LambdaPortsOutImpl(c);
  const portsIn = new PortsInImpl(config, portsOut, c);
  return { config, portsOut, portsIn };
};
