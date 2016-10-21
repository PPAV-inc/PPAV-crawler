import { VideoCollection, NewVideoCollection, SubscribeIdCollection } from './models/schema';

const removeSubscribeId = (senderID) => {
  return new Promise(resolve => {
    SubscribeIdCollection.remove({ senderID: senderID }, err => {
      if (err) {
        const str = '你尚未訂閱過喔';
        resolve(str);
      } else {
        const str = '成功取消訂閱';
        resolve(str);
      }
    });
  });
};

const findSubscribeId = () => {
  return new Promise(resolve => {
    let senderIdArr = [];
    SubscribeIdCollection.find().forEach(data => {
      senderIdArr.push(data);
    });
    resolve(senderIdArr);
  });
};

const findThreeNewVideos = () => {
  return new Promise(resolve => {
    NewVideoCollection.aggregate()
    .sort({ count: -1 })
    .limit(10)
    .sample(3)
    .exec((err, docs) => {
       resolve(docs);
    });
  });
};

const findThreeVideos = () => {
  return new Promise(resolve => {
    VideoCollection.aggregate()
    .sort({ count: -1 })
    .limit(50)
    .sample(3)
    .exec((err, docs) => {
       resolve(docs);
    });
  });
};

const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

const findVideo = (key, value) => {
  return new Promise(resolve => {
    const regex = new RegExp(escapeRegex(value), 'gi');

    VideoCollection.find().where(key, regex).exec((err, found) => {
      if (found.length === 0 && key === 'models' && value.length > 1) {
        findVideo(key, value.slice(0, -1)).then(returnObj => {
          resolve(returnObj);
        });
      } else {
        const limitNum = 5;
        let set = new Set();

        while (found.length !== 0 && set.size < limitNum) {
          let randNum = Math.floor(Math.random() * found.length);
          set.add(found[randNum]);
          found.splice([randNum], 1);
        }

        let returnObj = {};
        returnObj.search_value = value;
        returnObj.results = Array.from(set);
        resolve(returnObj);
      }
    });
  });
};

export { findThreeVideos, findVideo, findThreeNewVideos, findSubscribeId, removeSubscribeId };
