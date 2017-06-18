import axios from 'axios';

import AV from './av';
import getCheerio from '../getCheerio';

export default class myAVSuper extends AV {

  http;
  baseURL = 'https://myavsuper.com';

  constructor() {
    super();
    this.http = axios.create({
      baseURL: this.baseURL,
    });
  }

  getSearchUrls = async query => {
    const encodeStr = encodeURI(query);
    const { data } = await this.http.get(`?s=${encodeStr}`);
    const $ = getCheerio(data);
    const searchUrls = new Set();
    searchUrls.add(`${this.getBaseURL()}/page/1/?s=${query}`);

    $('a').each((i, e) => {
      const url = $(e).attr('href');
      if (this.hasPage(url)) {
        searchUrls.add(url);
      }
    });

    return searchUrls;
  };

  hasPage = url => {
    const re = new RegExp('/page/\\d+/?s=.*');
    return re.test(url);
  };

  getSource = () => 'myavsuper';
}
