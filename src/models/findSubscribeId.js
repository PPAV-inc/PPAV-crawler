import { SubscribeIdCollection } from './schema';

const findSubscribeId = () => {
  return new Promise(resolve => {
    let senderIdArr = [];
    SubscribeIdCollection.find({ isPushable: { $eq: true } }).exec((err, data) => {
      if (err) {
        console.log(err);
      } else {
        data.forEach(id => {
          senderIdArr.push(id);
        });
        resolve(senderIdArr);
      }
    });
  });
};

export default findSubscribeId;
