import axios from 'axios';

import AV from './AV';
import getCheerio from '../getCheerio';
import retryAxios from '../utils/retryAxios';

export default class Yahan extends AV {
  constructor() {
    super();
    this.source = 'yahan';
    this.baseURL = 'https://yahan.tv';
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
        this.http.get(`/bbs/board.php?bo_table=javc&page=${maxPageNum}`)
      );

      const $ = getCheerio(data);

      $('a').each((i, e) => {
        const url = $(e).attr('href') || '';
        const match = url.match(/.*bo_table=javc.*page=(\d+)/);
        if (match && +match[1] > maxPageNum) maxPageNum = +match[1];
      });

      for (let i = 1, len = maxPageNum; i <= len; i += 1) {
        searchUrls.add(`/bbs/board.php?bo_table=javc&page=${i}`);
      }
    } catch (err) {
      console.error(`err message: ${err.message}`);
      console.error(`error at ${this.source} axios.get page ${maxPageNum}`);
    }
    console.log(`get page num: ${maxPageNum}`);

    return searchUrls;
  };

  _getVideosCode = async urls => {
    const videosCode = [];

    for (let url of urls) {
      const { data } = await retryAxios(() => this.http.get(url));

      const $ = getCheerio(data);
      const target = $('title').text();
      const codes = []
        .concat(target.match(/\w+-\d+/g), target.match(/\w+-\w+-\d+/g))
        // filter not match
        .filter(code => !!code);

      url = url.includes(this.baseURL) ? url : `${this.baseURL}${url}`;
      codes.forEach(code => {
        videosCode.push({
          code: code.toUpperCase(),
          url,
          source: this.source,
        });
      });
    }

    return videosCode;
  };

  _filterVideoUrls = urls => {
    const filterUrls = urls.filter(url =>
      /bo_table=javc&wr_id=\d+&page=\d+/.test(url)
    );

    return filterUrls;
  };
}
