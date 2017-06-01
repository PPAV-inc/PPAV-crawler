import 'babel-polyfill';

import YouAV from './youav';
import CodeInfo from './codeInfo';

const test = async () => {
  const youav = new YouAV();
  const urls = await youav.getVideoUrls('彩乃');

  const codeInfo = new CodeInfo();
  const infos = [];

  for (const each of urls) {
    const code = each.code;
    const info = await codeInfo.getCodeInfo(code);

    if (info.title !== '') {
      infos.push({ ...info, ...each });
    }
  }

  console.log(infos);
};

test();
