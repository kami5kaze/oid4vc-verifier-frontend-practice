import { Hono } from 'hono';
import { Home } from './home';
import { InitiateTransaction } from './InitTransaction';

export const views = new Hono()
  .get('/home', (c) => c.render(<Home />))
  .get('/init', (c) => c.render(<InitiateTransaction />));
