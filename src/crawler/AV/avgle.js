import axios from 'axios';

import AV from './av';
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

  getSearchUrls = async query => {
    const searchUrls = new Set();
    searchUrls.add(
      `${this.baseURL}/search/videos?search_query=${query}&page=1`
    );

    const encodeStr = encodeURI(query);
    let pageNum = 1;
    let hasNextPage;
    do {
      hasNextPage = false;
      const { data } = await this.http.get(
        `/search/videos?search_query=${encodeStr}&page=${pageNum}`
      );
      const $ = getCheerio(data);
      pageNum += 1;

      // eslint-disable-next-line no-loop-func
      $('a').each((i, e) => {
        const url = $(e).attr('href');
        if (this.hasPage(url, pageNum)) {
          searchUrls.add(url);
          hasNextPage = true;
        }
      });
    } while (hasNextPage);
    console.log(`get page num: ${pageNum - 1}`);

    return searchUrls;
  };

  hasPage = (url, pageNum) => {
    const re = new RegExp(`search_query=.*&page=${pageNum}`);
    return re.test(url);
  };
}
