import cheerio from 'cheerio';

export default function getCheerio(html) {
  return cheerio.load(html);
}
