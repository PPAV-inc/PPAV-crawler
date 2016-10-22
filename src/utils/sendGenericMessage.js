import callSendAPI from './callSendAPI';

const sendGenericMessage = (recipientId, title, str, url, imgUrl) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [{
            title: title,
            subtitle: str,
            item_url: url,
            image_url: imgUrl,
            buttons: [{
              type: 'web_url',
              url: url,
              title: '開啟網頁',
            }],
          }],
        },
      },
    },
  };

  callSendAPI(messageData);
};

export default sendGenericMessage;
