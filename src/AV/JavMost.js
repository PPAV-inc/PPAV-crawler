import axios from 'axios';

import AV from './AV';
import getCheerio from '../getCheerio';
import retryAxios from '../utils/retryAxios';

export default class JavMost extends AV {
  constructor() {
    super();
    this.source = 'javmost';
    this.baseURL = 'https://www5.javmost.com';
    this.http = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
  }

  _getAllPagesUrls = async () => {
    const searchUrls = new Set();
    let maxPageNum = 1;

    try {
      const { data } = await retryAxios(() =>
        this.http.get(`/category/all/page/${maxPageNum}`)
      );

      const $ = getCheerio(data);

      // eslint-disable-next-line no-loop-func
      $('a').each((i, e) => {
        const url = $(e).attr('href') || '';
        const match = url.match(/.*\/category\/all\/page\/(\d+)/);
        if (match && +match[1] > maxPageNum) maxPageNum = +match[1];
      });

      for (let i = 1, len = maxPageNum; i <= len; i += 1) {
        searchUrls.add(`/category/all/page/${i}`);
      }
    } catch (err) {
      console.error(`err message: ${err.message}`);
      console.error(`error at ${this.source} axios.get page ${maxPageNum}`);
    }
    console.log(`get page num: ${maxPageNum}`);

    return searchUrls;
  };

  _filterVideoUrls = urls => {
    // filter not video url
    const filterUrls = urls.filter(url => !/tag/.test(url));
    return filterUrls;
  };
}
