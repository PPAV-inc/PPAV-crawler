import callSendAPI from './callSendAPI';

const sendGenericMessage = (recipientId, elements) => {
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

  callSendAPI(messageData);
};

export default sendGenericMessage;
