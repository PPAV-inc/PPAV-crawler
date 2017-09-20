import axios from 'axios';

import AV from './AV';
import getCheerio from '../getCheerio';
import retryAxios from '../utils/retryAxios';

export default class JavMost extends AV {
  constructor() {
    super();
    this.source = 'javmost';
    this.baseURL = 'http://www5.javmost.com';
    this.http = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
  }

  _getAllPagesUrls = async () => {
    const searchUrls = new Set();
    let maxPageNum = 1;

    try {
      const { data: { status, page } } = await retryAxios(() =>
        this.http.get(`/frontpage/showPage/${maxPageNum}/all/update`)
      );

      if (status.toLowerCase() !== 'success')
        throw new Error(`status is ${status}`);
      const $ = getCheerio(page);

      // eslint-disable-next-line no-loop-func
      $('a').each((i, e) => {
        const url = $(e).attr('href');
        const match = url.match(/javascript:change_page.*'(\d+)'.*/);
        if (match && +match[1] > maxPageNum) maxPageNum = +match[1];
      });

      for (let i = 1, len = maxPageNum; i <= len; i += 1) {
        searchUrls.add(`/frontpage/showPage/${i}/all/update`);
      }
    } catch (err) {
      console.error(`err message: ${err.message}`);
      console.error(`error at ${this.source} axios.get page ${maxPageNum}`);
    }
    console.log(`get page num: ${maxPageNum}`);

    return searchUrls;
  };

  _getVideoUrls = async pageUrls => {
    const videoUrls = [];
    let pageNum = 0;
    for (const pageUrl of pageUrls) {
      pageNum += 1;
      if (pageNum % 100 === 0) {
        console.log(`current pageNum: ${pageNum}`);
      }

      try {
        const { data: { status, data } } = await retryAxios(() =>
          this.http.get(pageUrl)
        );
        if (status.toLowerCase() !== 'success')
          throw new Error(`status is ${status}`);
        const $ = getCheerio(data);

        $('a').each((i, e) => {
          const url = $(e).attr('href') || '';
          videoUrls.push(url);
        });
      } catch (err) {
        console.error(`error message: ${err.message}`);
        console.error(`error at ${this.source} axios.get url ${pageUrl}`);
      }
    }

    return videoUrls;
  };
}
