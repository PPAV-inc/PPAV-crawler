import 'babel-polyfill';

import YouAV from './youav';
import IndexAV from './indexav';

const test = async () => {
  const youav = new YouAV();
  const videos = await youav.getVideos('彩乃');

  const indexav = new IndexAV();
  const infos = [];

  for (const each of videos) {
    const code = each.code;
    const info = await indexav.getCodeInfo(code);

    if (info.title !== '') {
      infos.push({ ...info, ...each });
    }
  }

  console.log(infos);
};

test();
