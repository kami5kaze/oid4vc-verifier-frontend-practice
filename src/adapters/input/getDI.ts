import { Context } from 'hono';
import { HonoConfiguration, PortsInImpl, PortsOutImpl } from '../../di';
import { Env } from '../../env';

export const getDI = (c: Context<Env>) => {
  const config = new HonoConfiguration(c);
  const portsOut = new PortsOutImpl();
  const portsIn = new PortsInImpl(config, portsOut);
  return { config, portsOut, portsIn };
};
