import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('SFXDX test API')
    .setDescription('SFXDX server API documentation')
    .setVersion('0.0.1')
    .addTag('Orders', 'Получение информации об ордерах')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  
  await app.listen(PORT, () => console.log(`[SERVER] Server running on port ${PORT}`));
}
bootstrap().then(() => {
  console.log(`------------------------------------`)
})
