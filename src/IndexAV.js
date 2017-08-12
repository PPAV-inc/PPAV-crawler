import axios from 'axios';

import getCheerio from './getCheerio';

export default class IndexAV {
  constructor() {
    this.baseURL = 'https://indexav.com';
    this.http = axios.create({
      baseURL: this.baseURL,
    });
  }

  searchCode = code => this.http.get(`/search?keyword=${code}`);

  getCodeInfo = async code => {
    const { data } = await this.searchCode(code);
    const $ = getCheerio(data);
    let title = '';
    let models = [];
    let imgUrl = '';

    $('div.bs-callout.bs-callout-odd')
      .children()
      .filter(
        (i, elem) =>
          $(elem)
            .children()
            .children()
            .children()
            .find('span.video_id')
            .text() === code
      )
      .children()
      .each((idx, elem) => {
        if ($(elem).hasClass('col-sm-7')) {
          title = $(elem).find('span.video_title').text();

          models = $(elem)
            .children()
            .children()
            .find('span.video_actor')
            .map((i, e) => $(e).text())
            .get();

          imgUrl = $(elem).find('span.preview_btn').attr('rel');
        }
      });

    return {
      title,
      models,
      img_url: imgUrl,
    };
  };
}
