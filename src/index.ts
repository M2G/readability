import 'module-alias/register';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import url from 'url';
import routes from './routes';
import loggerMiddleware from './middlewares';

const httpServer = createServer(function (
  request: IncomingMessage,
  response: ServerResponse,
): void {
  // @see https://gist.github.com/balupton/3696140
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Request-Method', '*');
  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  response.setHeader('Access-Control-Allow-Headers', '*');
  if (request.method === 'OPTIONS') {
    response.writeHead(200);
    response.end();
    return;
  }

  const parsedUrl = url.parse((request.url as string), true);
  const query = parsedUrl.query;
  const path = parsedUrl.pathname;
  const method = request?.method?.toUpperCase();

  let handler = path && routes[path] && routes[path][method];

  if (!handler) {
    const routeKeys = Object.keys(routes).filter((key) => key.includes(':'));

    const matchedKey = routeKeys.find((key) => {
      // replacing each segment of the key that starts with a colon (:)
      const regex = new RegExp(`^${key.replace(/:[^/]+/g, '([^/]+)')}$`);
      return path && regex.test(path);
    });

    if (matchedKey) {
      const regex = new RegExp(`^${matchedKey.replace(/:[^/]+/g, '([^/]+)')}$`);
      const dynamicParams = (regex as any).exec(path).slice(1);
      const dynamicHandler = routes[matchedKey][method];

      const paramKeys = matchedKey
        ?.match(/:[^/]+/g)
        ?.map((key) => key.substring(1));

      const params = paramKeys && dynamicParams?.reduce(
        (acc: any, val: any, i: string | number) => ({ ...acc, [paramKeys[i]]: val }),
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

// global middleware
httpServer.on('request', loggerMiddleware);

// starts a simple http server locally on port 3000
httpServer.listen(8484, '0.0.0.0', () => {
  console.log('Listening on 127.0.0.1:8484');
});
