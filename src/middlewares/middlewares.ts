import {IncomingMessage} from "http";

/**
 * Middleware function that logs the incoming request method and URL to the console.
 *
 * @param {import('http').IncomingMessage} req - The incoming request object.
 * @param {import('http').ServerResponse} res - The server response object.
 * @returns {void}
 */
function loggerMiddleware(request: IncomingMessage): void {
  console.log(`${request.method} ${request.url}`);
}

export default loggerMiddleware;
