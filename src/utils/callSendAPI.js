import rp from 'request-promise';
import config from '../config';

const PAGE_TOKEN = config.PAGE_TOKEN;

const callSendAPI = (messageData) => {
  const options = {
    method: 'POST',
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_TOKEN },
    json: messageData,
  };

  rp(options)
    .then(parsedBody => {
      const recipientId = parsedBody.recipient_id,
            messageId = parsedBody.message_id;
      
      console.log(`Successfully sent generic message with id ${messageId} to recipient ${recipientId}`);
    })
    .catch(err => {
      console.error(`Unable to send message. Error: ${err}`);
    });
};

export default callSendAPI;
