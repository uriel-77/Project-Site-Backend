import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { TipoMateria } from '../contenido/entities/contenido.entity';
import { PrismaService } from '../prisma/prisma.service';
import { SessionUser } from '../auth/auth.utils';
import { RolUsuario } from '../alumno/entities/alumno.entity';
import { UpsertQuizUnidadInput } from './dto/upsert-quiz-unidad.input';
import { RegistrarIntentoQuizInput } from './dto/registrar-intento-quiz.input';
import { DEFAULT_UNIT_QUIZZES } from './default-quizzes';

@Injectable()
export class QuizService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    if (process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      return;
    }

    await this.seedDefaultQuizzes();
  }

  async findPublicByMateria(tipoMateria: TipoMateria) {
    return this.prisma.findQuizUnidadesByMateria(tipoMateria, {
      onlyPublished: true,
      includeAnswers: false,
    });
  }

  async findEditableByMateria(tipoMateria: TipoMateria) {
    return this.prisma.findQuizUnidadesByMateria(tipoMateria, {
      onlyPublished: false,
      includeAnswers: true,
    });
  }

  async guardarQuizUnidad(datos: UpsertQuizUnidadInput) {
    this.validateQuizDraft(datos);
    return this.prisma.upsertQuizUnidad(datos);
  }

  async registrarIntento(datos: RegistrarIntentoQuizInput, usuario: SessionUser) {
    if (usuario.rol !== RolUsuario.ALUMNO) {
      throw new ForbiddenException('Solo los alumnos pueden registrar intentos de quiz');
    }

    const quiz = await this.prisma.findQuizUnidadById(datos.quizId, {
      onlyPublished: true,
      includeAnswers: true,
    });

    if (!quiz) {
      throw new BadRequestException('El quiz solicitado no existe o no está publicado');
    }

    const preguntas = quiz.preguntas || [];
    if (preguntas.length < 3) {
      throw new BadRequestException('El quiz no tiene suficientes preguntas publicadas');
    }

    if (!Array.isArray(datos.respuestasSeleccionadas) || datos.respuestasSeleccionadas.length !== preguntas.length) {
      throw new BadRequestException('Debes responder todas las preguntas del quiz');
    }

    const revisiones = preguntas.map((pregunta: any, index: number) => {
      const respuestaSeleccionada = datos.respuestasSeleccionadas[index];

      if (!Number.isInteger(respuestaSeleccionada) || respuestaSeleccionada < 0 || respuestaSeleccionada >= pregunta.opciones.length) {
        throw new BadRequestException(`La respuesta ${index + 1} no es válida`);
      }

      return {
        preguntaId: pregunta.id,
        respuestaSeleccionada,
        respuestaCorrectaIndex: pregunta.respuestaCorrectaIndex,
        esCorrecta: respuestaSeleccionada === pregunta.respuestaCorrectaIndex,
        explicacion: pregunta.explicacion || '',
      };
    });

    const aciertos = revisiones.filter((item) => item.esCorrecta).length;
    const totalPreguntas = preguntas.length;
    const porcentaje = Number(((aciertos / totalPreguntas) * 100).toFixed(2));

    const intento = await this.prisma.createQuizIntento({
      quizId: quiz.id,
      alumnoId: usuario.id,
      respuestasSeleccionadas: datos.respuestasSeleccionadas,
      aciertos,
      totalPreguntas,
      porcentaje,
    });

    return { intento, revisiones };
  }

  async obtenerMiProgreso(tipoMateria: TipoMateria, usuario: SessionUser) {
    const quizzes = await this.findPublicByMateria(tipoMateria);
    const intentos = await this.prisma.findQuizAttemptsByMateria(tipoMateria, {
      alumnoId: usuario.id,
    });

    return this.buildUnitProgress(quizzes, intentos);
  }

  async obtenerRendimiento(tipoMateria: TipoMateria, grupo?: string) {
    const quizzes = await this.findPublicByMateria(tipoMateria);
    const alumnos = (await this.prisma.alumno.findMany()).filter(
      (item: any) => item.rol === RolUsuario.ALUMNO && (!grupo || item.grupo === grupo),
    );
    const intentos = await this.prisma.findQuizAttemptsByMateria(tipoMateria, { grupo });

    return alumnos.map((alumno: any) => {
      const intentosAlumno = intentos.filter((item: any) => Number(item.alumnoId) === Number(alumno.id));
      const unidades = this.buildUnitProgress(quizzes, intentosAlumno);
      const quizzesCompletados = unidades.filter((item) => item.intentos > 0).length;
      const promedioDominio = quizzesCompletados
        ? Number(
            (
              unidades
                .filter((item) => item.intentos > 0)
                .reduce((acc, item) => acc + item.porcentajeMejor, 0) / quizzesCompletados
            ).toFixed(2),
          )
        : 0;

      return {
        alumnoId: alumno.id,
        nombre: alumno.nombre,
        apellido: alumno.apellido,
        grupo: alumno.grupo || '',
        quizzesCompletados,
        totalQuizzes: quizzes.length,
        promedioDominio,
        unidades,
      };
    });
  }

  private buildUnitProgress(quizzes: any[], intentos: any[]) {
    return quizzes.map((quiz) => {
      const intentosQuiz = intentos
        .filter((item) => Number(item.quizId) === Number(quiz.id))
        .sort(
          (a, b) =>
            new Date(b.completadoEn).getTime() - new Date(a.completadoEn).getTime() ||
            Number(b.id) - Number(a.id),
        );

      const mejor = intentosQuiz.reduce((acc, item) => Math.max(acc, Number(item.porcentaje || 0)), 0);
      const ultimo = intentosQuiz[0];

      return {
        quizId: quiz.id,
        unidadId: quiz.unidadId,
        unidadNombre: quiz.unidadNombre,
        titulo: quiz.titulo,
        intentos: intentosQuiz.length,
        porcentajeMejor: Number(mejor.toFixed(2)),
        porcentajeUltimo: ultimo ? Number(Number(ultimo.porcentaje || 0).toFixed(2)) : 0,
        completadoEn: ultimo?.completadoEn || null,
      };
    });
  }

  private validateQuizDraft(datos: UpsertQuizUnidadInput) {
    if (!datos.titulo?.trim()) {
      throw new BadRequestException('El quiz debe tener un título');
    }

    if (!Array.isArray(datos.preguntas) || datos.preguntas.length < 3) {
      throw new BadRequestException('Cada quiz debe tener al menos 3 preguntas');
    }

    datos.preguntas.forEach((pregunta, index) => {
      if (!pregunta.enunciado?.trim()) {
        throw new BadRequestException(`La pregunta ${index + 1} no tiene enunciado`);
      }

      if (!Array.isArray(pregunta.opciones) || pregunta.opciones.length < 2) {
        throw new BadRequestException(`La pregunta ${index + 1} debe tener al menos 2 opciones`);
      }

      pregunta.opciones.forEach((opcion, optionIndex) => {
        if (!String(opcion || '').trim()) {
          throw new BadRequestException(`La opción ${optionIndex + 1} de la pregunta ${index + 1} está vacía`);
        }
      });

      if (
        !Number.isInteger(pregunta.respuestaCorrectaIndex) ||
        pregunta.respuestaCorrectaIndex < 0 ||
        pregunta.respuestaCorrectaIndex >= pregunta.opciones.length
      ) {
        throw new BadRequestException(`La respuesta correcta de la pregunta ${index + 1} no es válida`);
      }
    });
  }

  private async seedDefaultQuizzes() {
    for (const tipoMateria of [TipoMateria.COMPILADORES, TipoMateria.TEORIA_DE_LA_COMPUTACION]) {
      const existentes = await this.prisma.findQuizUnidadesByMateria(tipoMateria, {
        onlyPublished: false,
        includeAnswers: true,
      });
      const existentesPorUnidad = new Map(existentes.map((item: any) => [Number(item.unidadId), item]));

      for (const quiz of DEFAULT_UNIT_QUIZZES.filter((item) => item.tipoMateria === tipoMateria)) {
        if (existentesPorUnidad.has(Number(quiz.unidadId))) {
          continue;
        }

        try {
          await this.prisma.upsertQuizUnidad(quiz);
        } catch (error) {
          // Si la unidad aún no existe en la base, omitimos la semilla sin bloquear el arranque.
        }
      }
    }
  }
}
