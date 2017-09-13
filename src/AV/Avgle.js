import axios from 'axios';

import AV from './AV';
import getCheerio from '../getCheerio';
import retryAxios from '../utils/retryAxios';

export default class Avgle extends AV {
  constructor() {
    super();
    this.source = 'avgle';
    this.baseURL = 'https://avgle.com';
    this.http = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
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

      try {
        /* eslint-disable no-loop-func */
        const { data } = await retryAxios(() =>
          this.http.get(
            `/search/videos?search_query=${encodeStr}&page=${pageNum}`
          )
        );
        /* eslint-enable no-loop-func */

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
      } catch (err) {
        console.error(`err message: ${err.message}`);
        console.error(`error at ${this.source} axios.get page ${pageNum}`);
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
