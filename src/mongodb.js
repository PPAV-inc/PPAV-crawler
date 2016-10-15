import { VideoCollection } from './models/schema';

export const findThreeVideos = () => {
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

export const findVideo = (key, value) => {
  return new Promise(resolve => {
    const regex = new RegExp(escapeRegex(value), 'gi');
  
    VideoCollection.find().where(key, regex).exec((err, found) => {
      if (found.length === 0 && key === 'models' && value.length > 1) {
        findVideo(key, value.slice(0, -1), (returnObj) => {
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

