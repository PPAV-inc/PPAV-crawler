import 'babel-polyfill';
import Videos_new from '../models/videos_new';
import findSubscribeId from '../models/findSubscribeId';

const getSubscribeData = () => {
  return new Promise(resolve => {
    Videos_new.getRandomThreeVideos().then(returnArr => {
      findSubscribeId().then(senderIDArr => {
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
