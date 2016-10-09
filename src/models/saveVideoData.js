import jsonfile from 'jsonfile';
import path from 'path';
import { VideoCollection } from './schema';

const jsonPath = path.join(__dirname, '..', 'public', 'film_info.json');

const saveVideoData = (obj) => {
  obj.forEach((value) => {
    let Video = new VideoCollection({
      id: value.id, 
      code: value.code,
      search_code: value.search_code, 
      title: value.title, 
      models: value.models, 
      count: value.count, 
      url: value.url, 
    });
    
    // Save it to database
    Video.save(function(err){
      if(err)
        console.log(err);
      else
        console.log("push" + value.code + " finished");
    });
  })
};

const obj = jsonfile.readFileSync(jsonPath);
saveVideoData(obj);