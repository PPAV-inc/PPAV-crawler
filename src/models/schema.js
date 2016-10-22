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
  update_date: Date,
}, { collection: 'videos_new' });

const videoSchema = new mongoose.Schema({
  id: Number,
  code: String,
  search_code: String,
  title: String,
  models: String,
  count: Number,
  url: String,
  img_url: String,
  update_date: Date,
}, { collection: 'videos' });

const logSchema = new mongoose.Schema({
  successOrNot: Boolean,
  senderID: String,
  messageText: String,
  result: String,
}, { collection: 'logs' });

const subscribeIdSchema = new mongoose.Schema({
  senderID: String,
}, { collection: 'subscribeids' });

export const VideoCollection = mongoose.model('videos', videoSchema);
export const NewVideoCollection = mongoose.model('videos_new', newVideoSchema);
export const LogCollection = mongoose.model('logs', logSchema);
export const SubscribeIdCollection = mongoose.model('subscribeids', subscribeIdSchema);
