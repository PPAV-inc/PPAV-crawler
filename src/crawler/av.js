import getCheerio from './getCheerio';

export default class AV {

  getBaseURL = () => {
    throw new Error('need to implement getBaseURL');
  }

	/* eslint-disable no-unused-vars*/
  search = query => {
    throw new Error('need to implement search');
  };
	/* eslint-enable no-unused-vars*/

  getUrlCode = (url) => {
    const re = new RegExp('(\\w+-){1,2}\\d+', 'g');
    return re.exec(url);
  };

  getVideoUrls = async query => {
		const { data } = await this.search(query);
		const $ = getCheerio(data);
		const urls = [];

		$('a').each((i, e) => {
			const url = $(e).attr('href');
			let code = this.getUrlCode(url);

			if (code !== null) {
				code = code[0].toUpperCase();
				urls.push({
					code,
					url: `${this.getBaseURL()}${url}`,
				});
			}
		});

		return urls;
  };

}
