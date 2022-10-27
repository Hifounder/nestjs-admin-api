import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { casbinInit, insertAllRules } from './packages/utils/role';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT);
  const server = app.getHttpServer();
  const routes = server._events.request._router.stack.filter((i) => i.route);
  const e = await casbinInit();
  await insertAllRules(e, routes);
}
bootstrap();
