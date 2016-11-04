import request from 'request-promise';
import findSubscribeId from '../models/findSubscribeId';
import config from '../config';

const data = config.TEST_MESSAGE;
const server = config.SERVER_ADDRESS;
const testUserArr = config.TEST_ARRAY;

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const sendFakeUserMessage = async () => {
  let senderIDArr = await findSubscribeId();
  senderIDArr = testUserArr;
  const url = server + '/webhook';

  for (let idx = 0; idx < senderIDArr.length; ++idx) {
    console.log(`${idx} / ${senderIDArr.length - 1} Sending to user: ${senderIDArr[idx].senderID}`);
    data.entry[0].messaging[0].sender.id = senderIDArr[idx].senderID;

    await request.post({ url: url, form: data }, err => {
      if (err) console.log(err);
    });
    await sleep(500); // sleep 0.5s
  }
};

export default sendFakeUserMessage;
