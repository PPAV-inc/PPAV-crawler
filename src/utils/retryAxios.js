import delay from 'delay';

const retryAxios = async (fn, { retryTime } = { retryTime: 5 }) => {
  for (let i = 1, len = retryTime; i <= len; i += 1) {
    try {
      return await fn();
    } catch (err) {
      console.error(`err message: ${err.message}, retry ${i} times`);
      await delay(1000);
    }
  }

  throw new Error('axios failed after retry');
};

export default retryAxios;
