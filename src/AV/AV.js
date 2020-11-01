import pMap from 'p-map';
import _debug from 'debug';
import randomUseragent from 'random-useragent';

import getCheerio from '../getCheerio';
import retryAxios from '../utils/retryAxios';

const debug = _debug('crawler');

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

  /* eslint-disable no-unused-vars */
  _getAllPagesUrls = (query) => {
    throw new Error('need to implement getAllPagesUrls');
  };
  /* eslint-enable no-unused-vars */

  _getCodeString = (url) => url;

  _getCodes = (target) =>
    []
      .concat(target.match(/\w+-\d+/g), target.match(/\w+-\w+-\d+/g))
      // filter not match
      .filter((code) => !!code);

  _getVideosCode = async (urls) => {
    const videosCode = [];

    for (let url of urls) {
      try {
        const target = await this._getCodeString(url);
        const codeArr = this._getCodes(target);

        const { hostname } = new URL(this.baseURL);
        url = url.includes(hostname) ? url : `${this.baseURL}${url}`;

        codeArr.forEach((code) => {
          videosCode.push({
            code: code.toUpperCase(),
            url,
            source: this.source,
          });
        });
      } catch (err) {
        console.error(`error message: ${err.message}`);
        console.error(`error happens at _getVideosCode, get ${url}`);
      }
    }

    return videosCode;
  };

  _getVideoUrls = async (pageUrls) => {
    const videoUrls = [];
    debug(`${this.source} pageUrls length: ${pageUrls.length}`);

    await pMap(
      pageUrls,
      async (pageUrl) => {
        try {
          const { data } = await retryAxios(() =>
            this.http.get(encodeURI(pageUrl), {
              headers: {
                'User-Agent': randomUseragent.getRandom(),
              },
            })
          );

          const $ = getCheerio(data);

          $('a').each((i, e) => {
            const url = $(e).attr('href') || '';
            videoUrls.push(url);
          });
        } catch (err) {
          console.error(`error message: ${err.message}`);
          console.error(`error at ${this.source} axios.get url ${pageUrl}`);
        }
      },
      { concurrency: 20 }
    );

    return videoUrls;
  };

  getVideos = async () => {
    const [...pageUrls] = await this._getAllPagesUrls();
    const videoUrls = await this._getVideoUrls(pageUrls);

    // remove duplicate url
    let filterUrls = [...new Set(videoUrls)];
    filterUrls = this._filterVideoUrls(filterUrls);
    const videos = await this._getVideosCode(filterUrls);

    return videos;
  };

  _filterVideoUrls = (urls) => {
    // filter not video url
    const filterUrls = urls.filter((url) => !/(search_query|\/\?s=)/.test(url));
    return filterUrls;
  };
}
