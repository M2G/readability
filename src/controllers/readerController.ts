import { IncomingMessage, ServerResponse } from 'http';
import Status from 'http-status';
import { response } from "src/utils";
import reader from "src/services";

async function readerController(request: IncomingMessage, res: ServerResponse) {
  try {
    const body = request.body;
    const article = await reader(body.url);

    console.log('article', article);

    if (!article) {
      return response(res, {
        data: { message: `'${body.url}' is not found` },
        status: Status.NOT_FOUND,
      });
    }

    response(res, { data: article?.textContent, status: Status.OK });
  } catch (error: { message: string }) {
    response(res, { status: Status.BAD_REQUEST, data: { message: error.message } });
  }
}

export default readerController;
