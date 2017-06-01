import axios from 'axios';

import Web from './Web';

export default class YouAV extends Web {

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
