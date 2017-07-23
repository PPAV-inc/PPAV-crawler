import getCheerio from '../getCheerio';

export default class AV {
  get source() {
    return this._source;
  }

  set source(source) {
    this._source = source;
  }

  get baseURL() {
    return this._baseURL;
  }

  set baseURL(url) {
    this._baseURL = url;
  }

  /* eslint-disable no-unused-vars*/
  getSearchUrls = query => {
    throw new Error('need to implement getSearchUrls');
  };
  /* eslint-enable no-unused-vars*/

  getUrlsCode = urls => {
    const urlsCode = [];

    urls.forEach(url => {
      const URL = url.includes(this.baseURL) ? url : `${this.baseURL}${url}`;
      const codeArr = []
        .concat(url.match(/\w+-\d+/g), url.match(/\w+-\w+-\d+/g))
        .filter(code => !!code);

      codeArr.forEach(code => {
        urlsCode.push({
          code: code.toUpperCase(),
          url: URL,
          source: this.source,
        });
      });
    });

    return urlsCode;
  };

  getVideos = async query => {
    const searchUrls = await this.getSearchUrls(query);
    const videoUrls = [];

    for (const searchUrl of searchUrls) {
      const { data } = await this.http.get(encodeURI(searchUrl));
      const $ = getCheerio(data);

      $('a').each((i, e) => {
        const url = $(e).attr('href') || '';
        videoUrls.push(url);
      });
    }

    return this.getUrlsCode(videoUrls);
  };
}
