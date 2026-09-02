import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Global Validation Pipe (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // Loại bỏ các field không có trong DTO
      forbidNonWhitelisted: true,
      transform: true,       // Tự động convert kiểu dữ liệu
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS
  const allowedOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',').map((u) => u.trim()) 
    : true;

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('ETC English Center API')
    .setDescription('Hệ thống quản lý trung tâm ngoại ngữ tích hợp AI — ETC English Center')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`🚀 ETC English Center API đang chạy tại: http://localhost:${port}`);
  console.log(`📚 Swagger Docs: http://localhost:${port}/api/docs`);
}
bootstrap();
