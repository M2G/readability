import { IncomingMessage } from 'http';
/**
 Returns a promise that resolves with the parsed JSON data of the request body.
 @param {Object} req - The HTTP request object
 @return {Promise} - A promise resolves with the parsed request body or rejects with an error
 */
function getPostBodyAsync(request: IncomingMessage): Promise<IncomingMessage>  {
  return new Promise(function (resolve, reject){
    let body = "";

    request.on("data", (chunk: string) => {
      body += chunk;
    });

    request.on("end", () => {
      try {
        body = body ? JSON.parse(body) : {};

        resolve(body as unknown as IncomingMessage);
      } catch (error) {
        reject(error);
      }
    });
  });
}

export default getPostBodyAsync;
