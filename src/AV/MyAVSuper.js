import axios from 'axios';

import AV from './AV';
import getCheerio from '../getCheerio';

export default class MyAVSuper extends AV {
  constructor() {
    super();
    this.source = 'myavsuper';
    this.baseURL = 'https://myavsuper.com';
    this.http = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
  }

  _getAllPagesUrls = async query => {
    const searchUrls = new Set();
    searchUrls.add(`${this.baseURL}/page/1/?s=${query}`);

    const encodeStr = encodeURI(query);
    let pageNum = 1;
    let hasNextPage;
    do {
      hasNextPage = false;
      const { data } = await this.http.get(`/page/1/?s=${encodeStr}`);
      const $ = getCheerio(data);
      pageNum += 1;

      // eslint-disable-next-line no-loop-func
      $('a').each((i, e) => {
        const url = $(e).attr('href');
        if (this._hasPage(url, pageNum)) {
          searchUrls.add(url);
          hasNextPage = true;
        }
      });
    } while (hasNextPage);
    console.log(`get page num: ${pageNum - 1}`);

    return searchUrls;
  };

  _hasPage = (url, pageNum) => {
    const re = new RegExp(`/page/${pageNum}/?s=.*`);
    return re.test(url);
  };
}
