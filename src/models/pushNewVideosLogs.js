import { PushNewVideoLogCollection } from './schema';

const saveNewVideos = (index, totalNumber, successNumber, overOneDayNumber, failedNumber) => {
  const timestamp = new Date();
  let PushNewVideoLog;

  PushNewVideoLog = new PushNewVideoLogCollection({
    totalNumber,
    successNumber,
    overOneDayNumber,
    failedNumber,
    timestamp,
  });

  PushNewVideoLog.save((err) => {
    if (err) {
      console.log(`儲存每日推播失敗：${err}`);
    } else {
      console.log(`${index} / ${totalNumber} 儲存每日推播完成！`);
    }
  });
};

export { saveNewVideos };
