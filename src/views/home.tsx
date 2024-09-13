import { FC } from 'hono/jsx';

export const Home: FC = () => {
  return (
    <section>
      <h1>This is Home</h1>
      <a href="/init">Initiate</a>
    </section>
  );
};
