import 'babel-polyfill';
import findThreeVideos from '../models/findThreeVideos';
import findSubscribeId from '../models/findSubscribeId';

const getSubscribeData = () => {
  return new Promise(resolve => {
    findThreeVideos(isNew = true).then(returnArr => {
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
