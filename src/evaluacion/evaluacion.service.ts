import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegistrarEntregaInput } from './dto/registrar-entrega.input';
import { GuardarCalificacionAsignacionInput } from './dto/guardar-calificacion-asignacion.input';
import { SessionUser } from '../auth/auth.utils';
import { RolUsuario } from '../alumno/entities/alumno.entity';

@Injectable()
export class EvaluacionService {
  constructor(private prisma: PrismaService) {}

  async registrarEntrega(datos: RegistrarEntregaInput, usuario: SessionUser) {
    if (usuario.rol === RolUsuario.ALUMNO && usuario.id !== datos.alumnoId) {
      throw new ForbiddenException('No puedes registrar entregas para otro alumno');
    }

    const alumnoId = Number(datos.alumnoId);
    const asignacionId = Number(datos.asignacionId);
    const nombreArchivo = (datos as any).nombreArchivo.replace(/'/g, "''");
    const mimeType = (datos as any).mimeType;
    const tamano = Number((datos as any).tamano || 0);
    const archivoBase64 = (datos as any).archivoBase64;

    const existe = await (this.prisma as any).queryOne(`
      SELECT id FROM "Entrega" 
      WHERE "asignacionId" = ${asignacionId} AND "alumnoId" = ${alumnoId}
    `);

    let query = '';
    
    if (existe) {
      query = `
        UPDATE "Entrega" 
        SET "nombreArchivo" = '${nombreArchivo}', 
            "mimeType" = '${mimeType}', 
            "tamano" = ${tamano}, 
            "archivoBase64" = '${archivoBase64}', 
            "entregadoEn" = NOW()
        WHERE id = ${existe.id}
        RETURNING id, "asignacionId", "alumnoId", "nombreArchivo", "mimeType", "tamano"
      `;
    } else {
      query = `
        INSERT INTO "Entrega" ("asignacionId", "alumnoId", "nombreArchivo", "mimeType", "tamano", "archivoBase64", "entregadoEn")
        VALUES (${asignacionId}, ${alumnoId}, '${nombreArchivo}', '${mimeType}', ${tamano}, '${archivoBase64}', NOW())
        RETURNING id, "asignacionId", "alumnoId", "nombreArchivo", "mimeType", "tamano"
      `;
    }

    return await (this.prisma as any).queryOne(query);
  }

  async obtenerEntregas(filtros: Record<string, unknown>, usuario: SessionUser) {
    const { grupo, parcial, alumnoId, asignacionId } = filtros as any;

    let query = `
      SELECT 
        e.id,
        e."alumnoId",
        e."asignacionId",
        e."entregadoEn",
        e.calificacion,
        a.grupo,
        a.periodo AS parcial
      FROM "Entrega" e
      LEFT JOIN "Asignacion" a ON e."asignacionId" = a.id
      WHERE 1=1
    `;

    if (usuario.rol === RolUsuario.ALUMNO) {
      query += ` AND e."alumnoId" = ${Number(usuario.id)}`;
    } else if (alumnoId) {
      query += ` AND e."alumnoId" = ${Number(alumnoId)}`;
    }

    // Filtros dinámicos que vienen del frontend
    if (grupo && grupo !== 'Todos') {
      query += ` AND a.grupo = '${grupo}'`;
    }

    if (parcial) {
      query += ` AND a.periodo = ${Number(parcial)}`;
    }

    if (asignacionId) {
      query += ` AND e."asignacionId" = ${Number(asignacionId)}`;
    }

    return await (this.prisma as any).queryRows(query);
  }

  guardarCalificacion(datos: GuardarCalificacionAsignacionInput) {
    return this.prisma.calificacionAsignacion.upsert({ data: datos });
  }

  obtenerCalificaciones(filtros: Record<string, unknown>, usuario: SessionUser) {
    if (usuario.rol === RolUsuario.ALUMNO) {
      return this.prisma.calificacionAsignacion.findMany({
        where: {
          ...filtros,
          alumnoId: usuario.id,
        },
      });
    }

    return this.prisma.calificacionAsignacion.findMany({ where: filtros });
  }
}
