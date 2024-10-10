import { html } from 'hono/html';
import { FC } from 'hono/jsx';

const tailwindConfig = html`
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            roboto: ['Roboto', 'sans-serif'],
          },
        },
      },
    };
  </script>
`;

export const Template: FC = ({ children }) => {
  return (
    <html>
      <head>
        <title>Verifier Frontend</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charset="UTF-8" />
        <meta name="description" content="Verifier Frontend Application" />
        <meta name="keywords" content="Verifier, Frontend, Application" />
        <meta name="author" content="Your Name" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
        />
        <link
          rel="icon"
          href="https://api.iconify.design/bi:person-vcard-fill.svg"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp,container-queries"></script>
        {tailwindConfig}
      </head>
      <body class="flex flex-col h-screen bg-white text-gray-900 font-roboto">
        <header class="bg-green-600 shadow-md p-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-white">Verifier Frontend</h1>
        </header>
        <main class="flex-grow p-6 bg-gray-100 shadow-md rounded-lg m-4">
          {children}
        </main>
        <footer class="bg-green-700 text-white p-4 mt-auto">
          <div class="text-center">© 2024 Verifier Frontend</div>
        </footer>
      </body>
    </html>
  );
};
