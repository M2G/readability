import { createServer } from 'node:http';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

async function reader(url) {
  const dom = await JSDOM.fromURL(url);
  const reader = new Readability(dom.window.document);
  return reader.parse();
}

const httpServer = createServer((req, res) => {
  const body = [];
  req
    .on('error', err => {
      console.error(err);
    })
    .on('data', chunk => {
      body.push(chunk);
    })
    .on('end', async () => {
      if (!body?.length) return;
      const data = Buffer.concat(body).toString();

     const { url } = JSON.parse(data);

      console.log('url url url', url);

      const article = await reader(url);

      console.log('body body body body body', article);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(article?.textContent);
    });
});

httpServer.on('request', (request, response) => {
  // On spécifie l'entête pour le CORS
  response.setHeader('Access-Control-Allow-Origin', '*');

  // On gère le cas où le navigateur fait un pré-contrôle avec OPTIONS ...
  // ... pas besoin d'aller plus loin dans le traitement, on renvoie la réponse
  if (request.method === 'OPTIONS') {
    // On liste des méthodes et les entêtes valides
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin, Authorization');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    return response.end();
  }

  // suite du traitement ...
});

// starts a simple http server locally on port 3000
httpServer.listen(8484, '0.0.0.0', () => {
  console.log('Listening on 127.0.0.1:8484');
});
