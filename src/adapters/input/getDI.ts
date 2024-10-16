import { Context } from 'hono';
import { HonoConfiguration, PortsInImpl, PortsOutImpl } from '../../di';
import { Env } from '../../env';

export const getDI = (c: Context<Env>) => {
  const config = new HonoConfiguration(c);
  const portsOut = new PortsOutImpl(c);
  const portsIn = new PortsInImpl(config, portsOut, c);
  return { config, portsOut, portsIn };
};
