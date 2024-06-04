import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

interface IReadability {
  title: string;
  content: string;
  textContent: string;
  length: number;
  excerpt: string;
  byline: string;
  dir: string;
  siteName: string;
  lang: string;
  publishedTime: string;
}

async function reader(url: string): Promise<IReadability | null> {
  const dom = await JSDOM.fromURL(url);
  const reader = new Readability(dom.window.document);
  return reader.parse();
}

export default reader;
