import mongoose from 'mongoose';
import config from '../../config';

mongoose.connect(config.MONGODB_PATH);

// Create a schema
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

// Create a model based on the schema
export const VideoCollection = mongoose.model('Video', videoSchema);

