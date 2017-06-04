import axios from 'axios';

import AV from './av';

export default class YouAV extends AV {

  http;
  baseURL = 'https://www.youav.com';

  constructor() {
    super();
    this.http = axios.create({
      baseURL: this.baseURL,
    });
  }

  getBaseURL = () => this.baseURL;

  search = query => {
    const encodeStr = encodeURI(query);
    return this.http.get(`/search/videos?search_query=${encodeStr}`);
  };

}
