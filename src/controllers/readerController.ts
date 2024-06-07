import { IncomingMessage, ServerResponse } from 'http';
import Status from 'http-status';
import { response } from "../utils";
import reader from "../services";

async function readerController(request: IncomingMessage, res: ServerResponse) {
  try {
    const body = request.body;
    const article = await reader(body.url);
    const textContent = article?.textContent && decodeURI(article.textContent);

    console.log('article', textContent);

    const excerpt = article?.excerpt && textContent && textContent.trim().substring(0,  textContent.trim().indexOf(article.excerpt));

    const text = excerpt && textContent?.replace(excerpt, '').replace(/\?|%3f/gi, '');

    console.log('ok ok ok', text);

    if (!article) {
      return response(res, {
        data: { message: `'${body.url}' is not found` },
        status: Status.NOT_FOUND,
      });
    }

    response(res, { data: text, status: Status.OK });
  } catch (error: { message: string }) {
    response(res, { status: Status.BAD_REQUEST, data: { message: error.message } });
  }
}

export default readerController;
