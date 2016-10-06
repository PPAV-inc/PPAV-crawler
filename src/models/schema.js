'use strict';

import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/ppav');

// Create a schema
const videoSchema = new mongoose.Schema({
  id: Number,
  code: String,
  search_code: String,
  title: String,
  models: String,
  count: String,
  url: String,
});

// Create a model based on the schema
export const VideoCollection = mongoose.model('Video', videoSchema);

