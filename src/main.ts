import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import mongoose from 'mongoose';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    const config = new DocumentBuilder()
        .setTitle('Stream Server')
        .setDescription('The Stream Server API description')
        .setVersion('0.1')
        .addTag('login')
        .addTag('setting')
        .addTag('user/stream')
        .addTag('user')
        .addSecurity('authorization', {
            type: 'apiKey',
            name: 'authorization',
            in: 'header',
        })
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    await app.listen(process.env.API_PORT);
    mongoose.set('debug', process.env.NODE_ENV === 'development');
}
bootstrap();
