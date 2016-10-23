import http from 'http';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import convert from 'koa-convert';
import monitor from 'koa-monitor';

import webhookRouter from './routes/webhook';
import postSubscribeRouter from './routes/postSubscribe';

const app = new Koa();

const useRouter = (application, router) => {
  application
    .use(router.routes())
    .use(router.allowedMethods());
};

app.use(compress());
app.use(bodyParser());

useRouter(app, webhookRouter);
useRouter(app, postSubscribeRouter);

const server = http.createServer(app.callback());

app.use(convert(monitor(server, { path: '/status' })));

export default server;
