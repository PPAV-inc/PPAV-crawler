'use strict';

import jsonfile from 'jsonfile';
import path from 'path';
import firebase from 'firebase';
import config from '../config';

firebase.initializeApp(config.FIREBASE_CONFIG);

const jsonPath = path.join(__dirname, '..', 'public', 'film_info.json');

const database = firebase.database();

const pushVideoData = (obj) => {
  obj.forEach((value) => {
    database.ref(value.code).set(value);
    console.log("push" + value.code + " finished");
  })
  console.log("push all finished");
}

const obj = jsonfile.readFileSync(jsonPath);
pushVideoData(obj);
