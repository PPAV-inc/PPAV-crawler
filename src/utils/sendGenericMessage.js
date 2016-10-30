import callSendAPI from './callSendAPI';

const sendGenericMessage = (recipientId, elements) => {
  return new Promise(resolve => {
    const messageData = {
      recipient: {
        id: recipientId,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements,
          },
        },
      },
    };
  
    callSendAPI(messageData).then(returnBool => {
      if (returnBool) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

export default sendGenericMessage;
