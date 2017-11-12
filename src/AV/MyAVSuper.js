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

  _getAllPagesUrls = async () => {
    const searchUrls = new Set();
    let maxPageNum = 1;

    try {
      const { data } = await this.http.get(`/page/1/?filter=date`);
      const $ = getCheerio(data);

      $('a').each((i, e) => {
        const url = $(e).attr('href') || '';
        const match = url.match(/.*\/page\/(\d+)\/\?filter=date/);
        if (match && +match[1] > maxPageNum) maxPageNum = +match[1];
      });

      for (let i = 1, len = maxPageNum; i <= len; i += 1) {
        searchUrls.add(`/page/${i}/?filter=date`);
      }
    } catch (err) {
      console.error(`err message: ${err.message}`);
      console.error(`error at ${this.source} axios.get`);
    }
    console.log(`get page num: ${maxPageNum}`);

    return searchUrls;
  };
}
