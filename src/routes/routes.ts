import { IncomingMessage, ServerResponse } from 'http';
import { response } from '@/utils';
import readerController from '@/controllers';
import validateUserData from '@/validation';

/**
 * Defines the routes and associated controllers for the application.
 *
 * @type {Object}
 * @property {Object} / - The root route.
 * @property {Object} /users - The users route.
 * @property {Object} /users/:id - The user by ID route.
 * @property {Function} notFound - The not found route controller.
 */
const routes = {
  '/': {
    GET: (request: IncomingMessage, res: ServerResponse) => {
      response(res, { data: { message: 'running nodejs api' } });
    },
  },
  '/article': {
    POST: (request: IncomingMessage, res: ServerResponse) => {
      validateUserData(request, res, readerController);
    },
  },
  notFound: (request: IncomingMessage, res: ServerResponse) => {
    response(res, {
      status: 404,
      data: { message: 'requested resource not found!' },
    });
  },
};

export default routes;
