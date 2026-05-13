import { NestFactory } from '@nestjs/core';
import { existsSync, readFileSync } from 'fs';
import { AppModule } from './app.module';

function getPort() {
  const envPort = process.env.PORT?.trim();

  if (envPort) {
    return Number(envPort);
  }

  if (existsSync('.env')) {
    const env = readFileSync('.env', 'utf8');
    const filePort = env.match(/PORT="?([^"\n]+)"?/)?.[1]?.trim();

    if (filePort) {
      return Number(filePort);
    }
  }

  return 3001;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  const port = getPort();
  await app.listen(port, '0.0.0.0');
  console.log(`SERVIDOR CORRIENDO EN: http://0.0.0.0:${port}/graphql`);
}
bootstrap();
