'use strict';

import { VideoCollection } from './models/schema';

const RETURN_NUM = 3;

const inArray = (arr, el) => {
    for (let i = 0 ; i < arr.length; i++) 
            if(arr[i] == el) return true;
    return false;
};

const getRandomIntNoDuplicates = (min, max, DuplicateArr) => {
    const RandomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    if (DuplicateArr.length > (max - min) ) return false;  // break endless recursion
    if (!inArray(DuplicateArr, RandomInt)) {
       DuplicateArr.push(RandomInt); 
       return RandomInt;
    }
    return getRandomIntNoDuplicates(min, max, DuplicateArr); 
};

const findVideoById = (id, retrunArr, callback) => {
  VideoCollection.find({id: id}, function (err, found) {
    let foundObj = found[0];
    
    if (foundObj != undefined) {
      retrunArr.push(foundObj);
      if (retrunArr.length == RETURN_NUM)
        callback(retrunArr);
    } else {
      findVideoById(id + 10, retrunArr, callback);
    }
  });
};

export const findThreeVideos = (callback) => {
  let duplicates = [],
      retrunArr = [];
      
  VideoCollection.count({}, (error, num) => {
    for (let i = 0; i < RETURN_NUM; i++) { 
      getRandomIntNoDuplicates(1, num, duplicates);
    }
    
    for (let i = 0; i < RETURN_NUM; i++) {
      findVideoById(duplicates[i], retrunArr, (retrunArr) => {
        callback(retrunArr);
      });
    }
  });
};

const escapeRegex = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

export const findVideo = (key, value, callback) => {
  const regex = new RegExp(escapeRegex(value), 'gi');

  VideoCollection.find().where(key, regex).exec((err, found) => {
    callback(found);
  });
};
