import getCheerio from '../getCheerio';
import retryAxios from '../utils/retryAxios';

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

  _getVideosCode = async urls => {
    const videosCode = [];

    urls.forEach(url => {
      // eslint-disable-next-line no-param-reassign
      url = url.includes(this.baseURL) ? url : `${this.baseURL}${url}`;
      const codeArr = []
        .concat(url.match(/\w+-\d+/g), url.match(/\w+-\w+-\d+/g))
        // filter not match
        .filter(code => !!code);

      codeArr.forEach(code => {
        videosCode.push({
          code: code.toUpperCase(),
          url,
          source: this.source,
        });
      });
    });

    return videosCode;
  };

  _getVideoUrls = async pageUrls => {
    const videoUrls = [];

    for (const pageUrl of pageUrls) {
      try {
        const { data } = await retryAxios(() =>
          this.http.get(encodeURI(pageUrl))
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
    }

    return videoUrls;
  };

  getVideos = async query => {
    const pageUrls = await this._getAllPagesUrls(query);
    const videoUrls = await this._getVideoUrls(pageUrls);

    // remove duplicate url
    let filterUrls = Array.from(new Set(videoUrls));
    filterUrls = this._filterVideoUrls(filterUrls);
    const videos = await this._getVideosCode(filterUrls);

    return videos;
  };

  _filterVideoUrls = urls => {
    // filter not video url
    const filterUrls = urls.filter(url => !/(search_query|\/\?s=)/.test(url));
    return filterUrls;
  };
}
