import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoInput } from './dto/create-video.input';
import { UpdateVideoInput } from './dto/update-video.input';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {}

  findAll(contenidoId?: number, asignacionId?: number, publicado?: boolean, tipoMateria?: string) {
    return this.prisma.video.findMany({
      where: {
        ...(typeof contenidoId === 'number' ? { contenidoId } : {}),
        ...(typeof asignacionId === 'number' ? { asignacionId } : {}),
        ...(typeof publicado === 'boolean' ? { publicado } : {}),
        ...(typeof tipoMateria === 'string' ? { tipoMateria } : {}),
      },
    });
  }

  findOne(id: number) {
    return this.prisma.video.findUnique({ where: { id } });
  }

  create(datos: CreateVideoInput) {
    if (!datos.contenidoId && !datos.tipoMateria) {
      throw new BadRequestException(
        'Los videos generales requieren tipoMateria cuando no están ligados a un contenido.',
      );
    }

    return this.prisma.video.create({ data: datos });
  }

  update(datos: UpdateVideoInput) {
    if (datos.contenidoId === null && !datos.tipoMateria) {
      throw new BadRequestException(
        'Los videos generales requieren tipoMateria cuando no están ligados a un contenido.',
      );
    }

    return this.prisma.video.update({ where: { id: datos.id }, data: datos });
  }

  remove(id: number) {
    return this.prisma.video.delete({ where: { id } });
  }
}
