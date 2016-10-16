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

const errorLogSchema = new mongoose.Schema({
  senderID: String,
  messageText: String,
  result: String,
});

const successLogSchema = new mongoose.Schema({
  senderID: String,
  messageText: String,
  result: String,
});

export const VideoCollection = mongoose.model('Video', videoSchema);
export const ErrorLogCollection = mongoose.model('ErrorLog', errorLogSchema);
export const SuccessLogCollection = mongoose.model('SuccessLog', successLogSchema);
