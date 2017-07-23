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
    const encodeStr = encodeURI(query);
    const { data } = await this.http.get(
      `/search/videos?search_query=${encodeStr}`
    );
    const $ = getCheerio(data);
    const searchUrls = new Set();
    searchUrls.add(
      `${this.baseURL}/search/videos?search_query=${query}&page=1`
    );

    $('a').each((i, e) => {
      const url = $(e).attr('href');
      if (this.hasPage(url)) {
        searchUrls.add(url);
      }
    });

    return searchUrls;
  };

  hasPage = url => {
    const re = new RegExp('search_query=.*&page=\\d+');
    return re.test(url);
  };
}
