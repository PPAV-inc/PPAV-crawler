import path from 'path';
import jsonfile from 'jsonfile';

const jsonPath = path.join(__dirname, '..', 'config.json');
const config = jsonfile.readFileSync(jsonPath);

export default config;
