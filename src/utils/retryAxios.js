import delay from 'delay';
import _debug from 'debug';

const debug = _debug('crawler');

const retryAxios = async (fn, { retryTime } = { retryTime: 5 }) => {
  for (let i = 1, len = retryTime; i <= len; i += 1) {
    try {
      return await fn();
    } catch (err) {
      debug(`err message: ${err.message}, retry ${i} times`);
      await delay(1000);
    }
  }

  throw new Error('axios failed after retry');
};

export default retryAxios;
