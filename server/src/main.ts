import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ResponseInterceptor } from './interceptors/response-global.interceptor';
import { json } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const SWAGGER_API_ROOT: string = 'api/v2/docs';

const SWAGGER_API_NAME: string = 'API';

const SWAGGER_API_DESCRIPTION: string =
  'Swagger Documentation for deeplaw end points';

const SWAGGER_API_CURRENT_VERSION: string = '1.0';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.use(json({ limit: '5mb' }));


  const options = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document);


  await app.listen(process.env.PORT || 9000);
  console.info(`Application is running on: ${await app.getUrl()}`);

}
bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
