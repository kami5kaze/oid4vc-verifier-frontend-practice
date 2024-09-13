import { Hono } from 'hono';
import { routes } from './api/backend';
import { jsxRenderer } from 'hono/jsx-renderer';
import { views } from './views';
import { API_PATH } from './consts';

const app = new Hono()
  .use(
    '*',
    jsxRenderer(({ children }) => {
      return (
        <html>
          <head>
            <title>Verifier Frontend</title>
            <link
              href="https://cdn.jsdelivr.net/npm/tailwindcss@2.0.2/dist/tailwind.min.css"
              rel="stylesheet"
            />
          </head>
          <body className="flex flex-col 100vh">
            <header className="navbar navbar-dark bg-dark">
              <a className="navbar-brand" href="#">
                Verifier Frontend
              </a>
            </header>
            <main class="flex-fill mx-4 my-3">{children}</main>
            <footer className="footer mt-auto py-3 bg-light">
              <div className="container">
                <span className="text-muted">
                  Place sticky footer content here.
                </span>
              </div>
            </footer>
          </body>
        </html>
      );
    })
  )
  .get('/', (c) => {
    return c.redirect('/home');
  })
  .route(API_PATH, routes)
  .route('/', views);

export type ApiRoutes = typeof routes;
export default app;
