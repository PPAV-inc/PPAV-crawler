import { VideoCollection } from './schema';

const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

const findVideo = (key, value) => {
  return new Promise(resolve => {
    const regex = new RegExp(escapeRegex(value), 'gi');

    VideoCollection.where(key, regex).exec((err, found) => {
      if (found.length === 0 && key === 'models' && value.length > 1) {
        findVideo(key, value.slice(0, -1)).then(returnObj => {
          resolve(returnObj);
        });
      } else {
        const limitNum = 10;
        const set = new Set();

        // get random film
        while (found.length !== 0 && set.size < limitNum) {
          const randNum = Math.floor(Math.random() * found.length);
          set.add(found[randNum]);
          found.splice([randNum], 1);
        }

        const returnObj = {};
        returnObj.search_value = value;
        returnObj.results = Array.from(set);
        resolve(returnObj);
      }
    });
  });
};

export default findVideo;
