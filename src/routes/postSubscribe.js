import 'babel-polyfill';
import Router from 'koa-router';
import config from '../config';
import postSubscribe from '../utils/postSubscribe';

const VERIFY_TOKEN = config.VERIFY_TOKEN;

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

export default postSubscribeRouter;
