import { GetStartedIdCollection } from './schema';

const saveUserInfo = (senderID, firstName, timeOfPostback) => new Promise(() => {
  GetStartedIdCollection.count({ senderID: senderID }, (err, count) => {
    if (count === 0) {
      const getStartedId = new GetStartedIdCollection({
        senderID,
        firstName,
        timeOfPostback,
      });

        // Save it to database
      getStartedId.save(errSave => {
        if (errSave) {
          console.log(errSave);
        } else {
          console.log(`save ${senderID} finished`);
        }
      });
    }
  });
});

export { saveUserInfo };
