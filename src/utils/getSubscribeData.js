import 'babel-polyfill';
import findThreeNewVideos from '../models/findThreeNewVideos';
import findSubscribeId from '../models/findSubscribeId';

const getSubscribeData = () => {
  return new Promise(resolve => {
    findThreeNewVideos().then(returnArr => {
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
