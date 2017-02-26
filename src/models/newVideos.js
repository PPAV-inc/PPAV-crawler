import { NewVideoCollection } from './schema';


const getRandomThreeVideos = () => {
    return new Promise(resolve => {
        NewVideoCollection.aggregate()
        .sort({ count: -1 })
        .limit(10)
        .sample(3)
        .exec((err, docs) => {
            resolve(docs);
         });
    });
};

export { getRandomThreeVideos };
