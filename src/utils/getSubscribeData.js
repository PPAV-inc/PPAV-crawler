import 'babel-polyfill';
import * as Videos_new from '../models/videos_new';
import * as Subscribe from '../models/subscribe';

const getSubscribeData = () => {
  return new Promise(resolve => {
    Videos_new.getRandomThreeVideos().then(returnArr => {
      Subscribe.findSubscribeId().then(senderIDArr => {
        const senderIDArrLength = senderIDArr.length;
        const count = senderIDArr.length;
        const returnObj = {
          returnArr,
          senderIDArr,
          senderIDArrLength,
          count,
        };
        resolve(returnObj);
      });
    });
  });
};

export default getSubscribeData;
