import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import mongoose from 'mongoose';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import logger from 'morgan';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix(process.env.GLOBAL_BASE_PATH);
    app.use(logger('dev'));
    const config = new DocumentBuilder()
        .setTitle('Stream Server')
        .setDescription('The Stream Server API description')
        .setVersion('0.1')
        .addTag('login')
        .addTag('setting')
        .addTag('user/stream')
        .addTag('user')
        .addTag('stream')
        .addSecurity('authorization', {
            type: 'apiKey',
            name: 'authorization',
            in: 'header',
        })
        .build();
    const document = SwaggerModule.createDocument(app, config, {
        ignoreGlobalPrefix: false,
        deepScanRoutes: true,
    });
    SwaggerModule.setup('docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    await app.listen(process.env.API_PORT);
    mongoose.set('debug', process.env.NODE_ENV === 'development');
}
bootstrap();
