import { IncomingMessage, ServerResponse } from 'http';
import { getPostBodyAsync, response } from '../utils';

/**
 * Middleware function to validate user data in a POST request.
 * @param {import('http').IncomingMessage} req - The incoming request object.
 * @param {import('http').ServerResponse} res - The server response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */

async function validateUserData(
  request: IncomingMessage,
  res: ServerResponse,
  next: {
    (
      request: IncomingMessage,
      res: ServerResponse<IncomingMessage>,
    ): void
    (arg0: IncomingMessage, arg1: ServerResponse<IncomingMessage>): void;
  },
) {
  try {
    const body = await getPostBodyAsync(request);

    if (!body.url) {
      return response(res, {
        status: 400,
        data: { message: 'URL is required' },
      });
    }

    request.body = body;

    next(request, res);
  } catch (error) {
    console.log(error);
    response(res, { status: 400, data: { message: error.message } });
  }
}

export default validateUserData;
