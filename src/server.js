import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import webhookRouter from './routes/webhook';

const app = new Koa();

const useRouter = (application, router) => {
  application
    .use(router.routes())
    .use(router.allowedMethods());
};

app.use(compress());
app.use(bodyParser());

useRouter(app, webhookRouter);

export default app;
