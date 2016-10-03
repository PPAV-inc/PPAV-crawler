'use strict';

import jsonfile from 'jsonfile';
import path from 'path';

const jsonPath = path.join(__dirname, '..', 'public', 'film_info.json');

const inArray = (arr, el) => {
    for (let i = 0 ; i < arr.length; i++) 
            if(arr[i] == el) return true;
    return false;
};

const getRandomIntNoDuplicates = (min, max, DuplicateArr) => {
    const RandomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    if (DuplicateArr.length > (max-min) ) return false;  // break endless recursion
    if (!inArray(DuplicateArr, RandomInt)) {
       DuplicateArr.push(RandomInt); 
       return RandomInt;
    }
    return getRandomIntNoDuplicates(min, max, DuplicateArr); 
};

const parseJson = () => {
  const obj = jsonfile.readFileSync(jsonPath);
  
  let duplicates = [],
      retrunArr = [];
      
  for (let i = 1; i <= 3 ; i++) { 
    getRandomIntNoDuplicates(1, obj.length, duplicates);
  }
    
  duplicates.forEach((value) => {
    retrunArr.push(obj[value].url);
  })
  
  return retrunArr;
};

export default parseJson;