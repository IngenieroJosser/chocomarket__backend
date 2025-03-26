import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // permite solo el frontend
    credentials: true, // por si usas cookies o headers personalizados
  });

  // si quiero permitir varios orígenes o todo (solo en desarrollo)
  /**
   * app.enableCors({
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
    });
  */

  // O incluso más abierto (⚠️ solo para desarrollo):
  // app.enableCors()

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
