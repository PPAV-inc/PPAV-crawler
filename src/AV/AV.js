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
  _getAllPagesUrls = query => {
    throw new Error('need to implement getAllPagesUrls');
  };
  /* eslint-enable no-unused-vars*/

  _getUrlsCode = urls => {
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

  _getVideoUrls = async pageUrls => {
    const videoUrls = [];

    for (const pageUrl of pageUrls) {
      for (let retryTime = 0; retryTime < 5; retryTime += 1) {
        try {
          const { data } = await this.http.get(encodeURI(pageUrl));
          const $ = getCheerio(data);

          $('a').each((i, e) => {
            const url = $(e).attr('href') || '';
            videoUrls.push(url);
          });

          break;
        } catch (err) {
          console.error(
            `error at ${this
              .source} axios.get url ${pageUrl}, retry ${retryTime} times`
          );
          await delay(1000);
        }
      }
    }

    return videoUrls;
  };

  getVideos = async query => {
    const pageUrls = await this._getAllPagesUrls(query);
    const videoUrls = await this._getVideoUrls(pageUrls);
    const videos = this._getUrlsCode(videoUrls);

    return videos;
  };
}
