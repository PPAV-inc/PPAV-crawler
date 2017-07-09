import { getDatabase } from './database';

const saveUserInfo = async senderID => {
  const user = {
    userId: senderID,
    created_at: new Date(),
  };

  const db = await getDatabase();
  await db.collection('users').update({ userId: senderID }, user, { upsert: true });
  console.log(`save ${senderID} finished`);
};

export { saveUserInfo };
