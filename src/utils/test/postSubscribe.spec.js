import 'babel-polyfill';
import findThreeNewVideos from '../../models/findThreeNewVideos';
import findSubscribeId from '../../models/findSubscribeId';

const postSubscribeTest = () => {
  return new Promise(resolve => {
    findThreeNewVideos().then(returnArr => {
      findSubscribeId().then(senderIDArr => {
        const senderIDArrLength = senderIDArr.length;
        let count = 0;
        senderIDArr.forEach(() => {
          count++;
        });
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

export default postSubscribeTest;

