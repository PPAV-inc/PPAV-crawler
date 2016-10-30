import 'babel-polyfill';
import Router from 'koa-router';
import config from '../config';
import postSubscribe from '../utils/postSubscribe';
import postSubscribeTest from '../utils/test/postSubscribe.spec';

const VERIFY_TOKEN = config.VERIFY_TOKEN;
const VERIFY_TOKEN_HASH = config.VERIFY_TOKEN_HASH;

const postSubscribeRouter = new Router();

postSubscribeRouter.post('/post-subscribe', async ctx => {
  const data = ctx.request.body;
  const res = ctx.response;
  
  if (data.verify_token === VERIFY_TOKEN) {
    try {
      postSubscribe();
      res.body = 'Post Subscribe Success';
    } catch (err) {
      res.body = err;
    }
  } else {
    res.body = 'Verify Token Error';
  }
});

postSubscribeRouter.get('/post-subscribe', async ctx => {
  const res = ctx.response;
  
  if (ctx.query.verify_token === VERIFY_TOKEN_HASH) {
    res.body = await postSubscribeTest().then(resultObj => {
      return resultObj;
    });
  } else {
    res.body = 'Verify Token Error';
  }
});

export default postSubscribeRouter;
