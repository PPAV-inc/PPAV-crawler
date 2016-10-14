import { VideoCollection } from './models/schema';

export const findThreeVideos = (callback) => {
  VideoCollection.aggregate()
    .sort({count: -1})
    .limit(50)
    .sample(3)
    .exec((err, docs) => {
       callback(docs);
    });
};

const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

export const findVideo = (key, value, callback) => {
  const regex = new RegExp(escapeRegex(value), 'gi');

  VideoCollection.find().where(key, regex).exec((err, found) => {
    if(found.length == 0 && key == 'models' && value.length > 1) {
      findVideo(key, value.slice(0, -1), (returnObj) => {
        callback(returnObj);
      });
    } else {
      let limit_num = 5;
      let set = new Set();

      while(found.length != 0 && set.size < limit_num) {
        let random_item = found[Math.floor(Math.random() * found.length)];
        set.add(random_item);
      }

      let returnObj = {};
      returnObj.search_value = value;
      returnObj.results =  Array.from(set);
      callback(returnObj);
    }
  });
};

