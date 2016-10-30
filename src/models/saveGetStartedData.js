import { GetStartedIdCollection } from './schema';

const saveGetStartedData = (senderID, firstName, timeOfPostback) => {
  return new Promise(() => {
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
};

export default saveGetStartedData;
