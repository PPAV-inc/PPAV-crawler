import delay from 'delay';

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

    // filter not video url
    const filterUrls = urls.filter(url => !/(search_query|\/\?s=)/.test(url));

    filterUrls.forEach(url => {
      // eslint-disable-next-line no-param-reassign
      url = url.includes(this.baseURL) ? url : `${this.baseURL}${url}`;
      const codeArr = []
        .concat(url.match(/\w+-\d+/g), url.match(/\w+-\w+-\d+/g))
        // filter not match
        .filter(code => !!code);

      codeArr.forEach(code => {
        urlsCode.push({
          code: code.toUpperCase(),
          url,
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
      let data;

      let retryTime = 3;
      while (retryTime > 0) {
        try {
          const response = await this.http.get(encodeURI(searchUrl));
          data = response.data;
          break;
        } catch (err) {
          console.error(
            `error when ${this.source}
              axios.get url ${searchUrl}, delay 1 s, retry ${retryTime} times`
          );
          retryTime -= 1;
          await delay(1000);
        }
      }

      const $ = getCheerio(data);

      $('a').each((i, e) => {
        const url = $(e).attr('href') || '';
        videoUrls.push(url);
      });
    }

    return this.getUrlsCode(videoUrls);
  };
}
