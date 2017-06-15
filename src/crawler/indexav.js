import axios from 'axios';

import getCheerio from './getCheerio';

export default class IndexAV {

  http;
  baseURL = 'https://indexav.com';

  constructor() {
    this.http = axios.create({
      baseURL: this.baseURL,
    });
  }

  searchCode = code => this.http.get(`/search?keyword=${code}`);

  getCodeInfo = async code => {
    const { data } = await this.searchCode(code);
    const $ = getCheerio(data);

    return {
      title: $('span.video_title').text(),
      models: $('span.video_actor').map((i, e) => {
        return $(e).text();
      }).get(),
      img_url: $('span.preview_btn').attr('rel'),
    };
  };
}
