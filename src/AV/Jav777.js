import axios from 'axios';

import AV from './AV';
import getCheerio from '../getCheerio';
import retryAxios from '../utils/retryAxios';

export default class Jav777 extends AV {
  constructor() {
    super();
    this.source = 'jav777';
    this.baseURL = 'http://www.jav777.xyz';
    this.http = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
  }

  _getCodes = (target) =>
    []
      .concat(target.match(/\w+-\d+/g), target.match(/\w+-\w+-\d+/g))
      .filter((code) => !!code)
      .map((code) => code.replace(/^(hd-|fhd-)/, ''));

  _getAllPagesUrls = async () => {
    const searchUrls = new Set();
    let maxPageNum = 1;

    try {
      const { data } = await retryAxios(() => this.http.get('/page/1'));

      const $ = getCheerio(data);

      const pageStr = $('div.page-title.section-inner h5').text();
      for (const num of pageStr.match(/\d+/g)) {
        if (+num > maxPageNum) {
          maxPageNum = +num;
        }
      }

      for (let i = 1, len = maxPageNum; i <= len; i += 1) {
        searchUrls.add(`/page/${i}`);
      }
    } catch (err) {
      console.error(`err message: ${err.message}`);
      console.error(`error at ${this.source} axios.get`);
    }

    return [...searchUrls];
  };

  _filterVideoUrls = (urls) => {
    // filter not video url
    const filterUrls = urls.filter((url) => /\.html/.test(url));

    return filterUrls;
  };
}
