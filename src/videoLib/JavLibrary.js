import axios from 'axios';

import getCheerio from '../getCheerio';

export default class JavLibrary {
  constructor() {
    this.baseURL = 'http://www.javlibrary.com/tw';
    this.http = axios.create({
      baseURL: this.baseURL,
      headers: { Cookie: 'over18=18' },
    });
  }

  _isSearchPage = data => /識別碼搜尋結果/.test(data);
  _hasResult = data => !/(搜尋沒有結果|搜尋字串是無效)/.test(data);

  _getVideoUrl = (code, $) => {
    const url = $('div.video')
      .filter((i, elem) => $(elem).children().find('div.id').text() === code)
      .find('a')
      .attr('href');

    return url.slice(1);
  };

  _getCodePage = async code => {
    const { data } = await this.http.get(`/vl_searchbyid.php?keyword=${code}`);

    if (!this._hasResult(data)) {
      throw new Error(`code: ${code}, video not found`);
    }

    let $ = getCheerio(data);
    if (this._isSearchPage(data)) {
      const url = this._getVideoUrl(code, $);
      const response = await this.http.get(url);

      $ = getCheerio(response.data);
    }

    return $;
  };

  getCodeInfos = async code => {
    const $ = await this._getCodePage(code);

    const id = $('#video_id td.text').text();

    if (id !== code) {
      throw new Error(`code: ${code}, is not same as ${id}`);
    }

    const publishedAt = new Date($('#video_date td.text').text());
    const length = $('#video_length td').eq(1).text();
    const score = Number($('#video_review span.score').text().slice(1, -1));
    const tags = [];
    $('#video_genres span.genre').each((i, elem) => {
      tags.push($(elem).text());
    });

    return {
      id,
      publishedAt,
      length,
      score,
      tags,
    };
  };
}
