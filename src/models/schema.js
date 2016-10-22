import jsonfile from 'jsonfile';
import mongoose from 'mongoose';
import path from 'path';

const jsonPath = path.join(__dirname, '..', '..', 'config.json');
const config = jsonfile.readFileSync(jsonPath);
mongoose.connect(config.MONGODB_PATH);

const newVideoSchema = new mongoose.Schema({
  id: Number,
  code: String,
  search_code: String,
  title: String,
  models: String,
  count: Number,
  url: String,
  img_url: String,
});

const videoSchema = new mongoose.Schema({
  id: Number,
  code: String,
  search_code: String,
  title: String,
  models: String,
  count: Number,
  url: String,
  img_url: String,
});

const logSchema = new mongoose.Schema({
  successOrNot: String,
  senderID: String,
  messageText: String,
  result: String,
});

const subscribeIdSchema = new mongoose.Schema({
  senderID: String,
});

export const VideoCollection = mongoose.model('Video', videoSchema);
export const NewVideoCollection = mongoose.model('NewVideo', newVideoSchema);
export const LogCollection = mongoose.model('Log', logSchema);
export const SubscribeIdCollection = mongoose.model('SubscribeId', subscribeIdSchema);
