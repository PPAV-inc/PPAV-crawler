import { PushNewVideoCollection } from './schema';

const savePushNewVideoData = (totalNumber, successNumber, overOneDayNumber, failedNumber) => {
  const timestamp = new Date();
  let PushNewVideo;

  PushNewVideo = new PushNewVideoCollection({
    totalNumber,
    successNumber,
    overOneDayNumber,
    failedNumber,
    timestamp,
  });

  PushNewVideo.save((err) => {
    if (err) {
      console.log(`儲存每日推播失敗：${err}`);
    } else {
      console.log('儲存每日推播完成！');
    }
  });
};

export default savePushNewVideoData;
