import { Injectable } from '@nestjs/common';
import { CreateUnidadInput } from './dto/create-unidad.input';
import { UpdateUnidadInput } from './dto/update-unidad.input';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UnidadService {
  async findAll() {
    return await prisma.unidad.findMany({
      include: { 
        contenidos: { orderBy: { orden: 'asc' } } 
      },
      orderBy: { id: 'asc' }
    });
  }

  async findOne(id: number) {
    return await prisma.unidad.findUnique({
      where: { id },
      include: { contenidos: true }
    });
  }

  create(createUnidadInput: CreateUnidadInput) {
    return 'Pendiente: Conectar con prisma.unidad.create';
  }

  update(id: number, updateUnidadInput: UpdateUnidadInput) {
    return `Pendiente: Conectar con prisma.unidad.update para el ID ${id}`;
  }

  remove(id: number) {
    return `Pendiente: Conectar con prisma.unidad.delete para el ID ${id}`;
  }
}