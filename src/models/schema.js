import mongoose from 'mongoose';
import config from '../../config';

mongoose.connect(config.MONGODB_PATH);

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
  senderID: String,
  messageText: String,
  result: String,
});

export const VideoCollection = mongoose.model('Video', videoSchema);
export const LogCollection = mongoose.model('Log', logSchema);

