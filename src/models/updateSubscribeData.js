import { SubscribeIdCollection } from './schema';

const updateSubscribeData = (id) => {
  return new Promise(resolve => {
    SubscribeIdCollection.update(
      { senderID: id },
      { $set: { isPushable: true } },
      { upsert: false },
      err => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    );
  });
};

export default updateSubscribeData;
