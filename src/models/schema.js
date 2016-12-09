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
  tags: [String],
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
  tags: [String],
}, { collection: 'videos' });

const logSchema = new mongoose.Schema({
  successOrNot: Boolean,
  senderID: String,
  messageText: String,
  result: String,
  timestamp: Date,
}, { collection: 'logs' });

const subscribeIdSchema = new mongoose.Schema({
  senderID: String,
  isPushable: Boolean,
}, { collection: 'subscribe_ids' });

const getStartedIdSchema = new mongoose.Schema({
  senderID: String,
  firstName: String,
  timeOfPostback: Date,
}, { collection: 'getstarted_ids' });

const pushNewVideoLogSchema = new mongoose.Schema({
  totalNumber: Number,
  successNumber: Number,
  overOneDayNumber: Number,
  failedNumber: Number,
  timestamp: Date,
}, { collection: 'push_new_video_logs' });

export const VideoCollection = mongoose.model('videos', videoSchema);
export const NewVideoCollection = mongoose.model('videos_new', newVideoSchema);
export const LogCollection = mongoose.model('logs', logSchema);
export const SubscribeIdCollection = mongoose.model('subscribe_ids', subscribeIdSchema);
export const GetStartedIdCollection = mongoose.model('getstarted_ids', getStartedIdSchema);
export const PushNewVideoLogCollection = mongoose.model('push_new_video_logs', pushNewVideoLogSchema);
