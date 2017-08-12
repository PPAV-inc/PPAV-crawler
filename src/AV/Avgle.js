import axios from 'axios';
import delay from 'delay';

import AV from './AV';
import getCheerio from '../getCheerio';

export default class Avgle extends AV {
  constructor() {
    super();
    this.source = 'avgle';
    this.baseURL = 'https://avgle.com';
    this.http = axios.create({
      baseURL: this.baseURL,
    });
  }

  _getAllPagesUrls = async query => {
    const searchUrls = new Set();
    searchUrls.add(
      `${this.baseURL}/search/videos?search_query=${query}&page=1`
    );

    const encodeStr = encodeURI(query);
    let pageNum = 1;
    let hasNextPage;
    do {
      hasNextPage = false;

      let retryTime = 5;
      while (retryTime > 0) {
        try {
          const { data } = await this.http.get(
            `/search/videos?search_query=${encodeStr}&page=${pageNum}`
          );

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
          break;
        } catch (err) {
          console.error(
            `error at ${this
              .source} axios.get page ${pageNum}, retry ${retryTime} times`
          );
          retryTime -= 1;
          await delay(1000);
        }
      }
    } while (hasNextPage);
    console.log(`get page num: ${pageNum - 1}`);

    return searchUrls;
  };

  _hasPage = (url, pageNum) => {
    const re = new RegExp(`search_query=.*&page=${pageNum}`);
    return re.test(url);
  };
}
