import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import { existsSync, readFileSync } from 'fs';
import { AppModule } from './app.module';

function getPort() {
  const envPort = process.env.PORT?.trim();

  if (envPort) {
    return Number(envPort);
  }

  const envFile = ['.env', 'env'].find((fileName) => existsSync(fileName));

  if (envFile) {
    const env = readFileSync(envFile, 'utf8');
    const filePort = env.match(/PORT="?([^"\n]+)"?/)?.[1]?.trim();

    if (filePort) {
      return Number(filePort);
    }
  }

  return 3001;
}

function getCorsOrigin() {
  const origin = process.env.CORS_ORIGIN?.trim();

  if (!origin) {
    return true;
  }

  return origin.split(',').map((item) => item.trim()).filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '15mb' }));
  app.use(urlencoded({ extended: true, limit: '15mb' }));
  app.enableCors({
    origin: getCorsOrigin(),
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  const port = getPort();
  await app.listen(port, '0.0.0.0');
  console.log(`SERVIDOR CORRIENDO EN: http://0.0.0.0:${port}/graphql`);
}

let cachedHandler: ((req: any, res: any) => void | Promise<void>) | null = null;

async function createServerlessHandler() {
  const express = require('express');
  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { logger: ['error', 'warn', 'log'] },
  );
  app.use(json({ limit: '15mb' }));
  app.use(urlencoded({ extended: true, limit: '15mb' }));
  app.enableCors({
    origin: getCorsOrigin(),
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.init();
  return expressApp;
}

export default async function handler(req: any, res: any) {
  try {
    if (!cachedHandler) {
      cachedHandler = await createServerlessHandler();
    }

    return cachedHandler!(req, res);
  } catch (error) {
    console.error('Error al inicializar el handler de Vercel:', error);

    if (!res.headersSent) {
      res.status(500).json({
        ok: false,
        message: error instanceof Error ? error.message : 'Error interno al iniciar la aplicacion',
      });
    }
  }
}

if (!process.env.VERCEL) {
  bootstrap();
}
