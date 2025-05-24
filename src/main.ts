import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

if (process.env.ENABLE_APM === '1') {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	require('elastic-apm-node').start({
		serviceName: 'disaster-alert-api',
		serverUrl: process.env.ELASTIC_APM_SERVER_URL,
		secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
		environment: process.env.NODE_ENV,
		active: true,
		captureBody: 'all',
		errorOnAbortedRequests: true,
		captureErrorLogStackTraces: 'always'
	});
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Disaster Alert API')
    .setDescription('Disaster Alert API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(config.getOrThrow<number>('APP_PORT') ?? 4000);
}
bootstrap();
