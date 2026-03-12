import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ContenidoService {
  async findAll() {
    // Esto va a la base de datos real de PostgreSQL
    return await prisma.contenido.findMany();
  }

  async findOne(id: number) {
    return await prisma.contenido.findUnique({
      where: { id }
    });
  }
}