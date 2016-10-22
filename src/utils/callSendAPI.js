import request from 'request';
import config from '../config';

const PAGE_TOKEN = config.PAGE_TOKEN;

const callSendAPI = (messageData) => {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_TOKEN },
    method: 'POST',
    json: messageData,
  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const recipientId = body.recipient_id,
            messageId = body.message_id;

      console.log(`Successfully sent generic message with id ${messageId} to recipient ${recipientId}`);
    } else {
      console.error('Unable to send message.');
      // console.error(response);
    }
  });
};

export default callSendAPI;
