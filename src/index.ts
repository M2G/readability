import 'module-alias/register';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import url from 'url';
import routes from './routes';
import loggerMiddleware from './middlewares';

const httpServer = createServer(function(request: IncomingMessage, response: ServerResponse) {
  const parsedUrl = url.parse(request.url, true);
  const query = parsedUrl.query;
  const path = parsedUrl.pathname;
  const method = request?.method?.toUpperCase();

  let handler = routes[path] && routes[path][method];

  if (!handler) {
    const routeKeys = Object.keys(routes).filter((key) => key.includes(':'));

    const matchedKey = routeKeys.find((key) => {
      // replacing each segment of the key that starts with a colon (:)
      const regex = new RegExp(`^${key.replace(/:[^/]+/g, '([^/]+)')}$`);
      return regex.test(path);
    });


    if (matchedKey) {
      const regex = new RegExp(`^${matchedKey.replace(/:[^/]+/g, '([^/]+)')}$`);
      const dynamicParams = regex?.exec(path).slice(1);
      const dynamicHandler = routes[matchedKey][method];

      const paramKeys = matchedKey?.match(/:[^/]+/g)
        .map((key) => key.substring(1));

      const params = dynamicParams.reduce(
        (acc, val, i) => ({ ...acc, [paramKeys[i]]: val }),
        {},
      );

      // set params in req
      request.params = params;

      handler = dynamicHandler;
    }
  }

  // url and method not match
  if (!handler) {
    handler = routes.notFound;
  }

  // set query string in req
  request.query = {};

  for (const key in query) {
    request.query[key] = query[key];
  }

  handler(request, response);
});

httpServer.on('request', (request, response) => {
  // On spécifie l'entête pour le CORS
  response.setHeader('Access-Control-Allow-Origin', '*');

  // On gère le cas où le navigateur fait un pré-contrôle avec OPTIONS ...
  // ... pas besoin d'aller plus loin dans le traitement, on renvoie la réponse
  if (request.method === 'OPTIONS') {
    // On liste des méthodes et les entêtes valides
    response.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, Origin, Authorization',
    );
    response.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    );

    return response.end();
  }

  // suite du traitement ...
});

// global middleware
httpServer.on('request', loggerMiddleware);

// starts a simple http server locally on port 3000
httpServer.listen(8484, '0.0.0.0', () => {
  console.log('Listening on 127.0.0.1:8484');
});
