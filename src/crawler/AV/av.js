import getCheerio from '../getCheerio';

export default class AV {

  getBaseURL = () => this.baseURL;

  /* eslint-disable no-unused-vars*/
  getSearchUrls = query => {
    throw new Error('need to implement getSearchUrls');
  };

  getSource = () => {
    throw new Error('need to implement getSearchUrls');
  };
  /* eslint-enable no-unused-vars*/

  getUrlsCode = urls => {
    const re = new RegExp('(\\w+-){1,2}\\d+');
    const urlsCode = [];

    urls.forEach(url => {
      let code = re.exec(url);

      if (code !== null) {
        code = code[0].toUpperCase();
        const URL = url.indexOf(this.getBaseURL()) === -1 ? `${this.getBaseURL()}${url}` : url;
        urlsCode.push({
          code,
          url: URL,
          source: this.getSource(),
        });
      }
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
        const url = $(e).attr('href');
        videoUrls.push(url);
      });
    }

    return this.getUrlsCode(videoUrls);
  };

}
