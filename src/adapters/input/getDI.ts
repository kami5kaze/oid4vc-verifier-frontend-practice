import { Context } from 'hono';
import { Env } from '../../di/env';
import { HonoConfiguration } from '../../di/HonoConfiguration';
import { PortsOutImpl } from '../../di/PortsOutImpl';
import { PortsInImpl } from '../../di/PortsInImpl';

export const getDI = (c: Context<Env>) => {
  const config = new HonoConfiguration(c);
  const portsOut = new PortsOutImpl();
  const portsIn = new PortsInImpl(config, portsOut);
  return { config, portsOut, portsIn };
};
