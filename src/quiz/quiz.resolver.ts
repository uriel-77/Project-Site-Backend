import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QuizService } from './quiz.service';
import {
  QuizDominioUnidad,
  QuizIntentoResultado,
  QuizRendimientoAlumno,
  QuizUnidad,
  QuizUnidadEditable,
} from './entities/quiz.entity';
import { TipoMateria } from '../contenido/entities/contenido.entity';
import { UpsertQuizUnidadInput } from './dto/upsert-quiz-unidad.input';
import { RegistrarIntentoQuizInput } from './dto/registrar-intento-quiz.input';
import { AlumnoService } from '../alumno/alumno.service';
import { RolUsuario } from '../alumno/entities/alumno.entity';

@Resolver()
export class QuizResolver {
  constructor(
    private readonly quizService: QuizService,
    private readonly alumnoService: AlumnoService,
  ) {}

  @Query(() => [QuizUnidad], { name: 'quizzesPorMateria' })
  quizzesPorMateria(
    @Args('tipoMateria', { type: () => TipoMateria }) tipoMateria: TipoMateria,
    @Context() context: any,
  ) {
    this.alumnoService.getSessionUserFromContext(context);
    return this.quizService.findPublicByMateria(tipoMateria);
  }

  @Query(() => [QuizDominioUnidad], { name: 'miProgresoQuizzes' })
  miProgresoQuizzes(
    @Args('tipoMateria', { type: () => TipoMateria }) tipoMateria: TipoMateria,
    @Context() context: any,
  ) {
    const usuario = this.alumnoService.getSessionUserFromContext(context);
    return this.quizService.obtenerMiProgreso(tipoMateria, usuario);
  }

  @Query(() => [QuizUnidadEditable], { name: 'quizzesGestionPorMateria' })
  quizzesGestionPorMateria(
    @Args('tipoMateria', { type: () => TipoMateria }) tipoMateria: TipoMateria,
    @Context() context: any,
  ) {
    this.alumnoService.requireRoles(context, [RolUsuario.MODERADOR, RolUsuario.ADMINISTRADOR]);
    return this.quizService.findEditableByMateria(tipoMateria);
  }

  @Query(() => [QuizRendimientoAlumno], { name: 'rendimientoQuizzesMateria' })
  rendimientoQuizzesMateria(
    @Args('tipoMateria', { type: () => TipoMateria }) tipoMateria: TipoMateria,
    @Args('grupo', { type: () => String, nullable: true }) grupo: string | undefined,
    @Context() context: any,
  ) {
    this.alumnoService.requireRoles(context, [RolUsuario.MODERADOR, RolUsuario.ADMINISTRADOR]);
    return this.quizService.obtenerRendimiento(tipoMateria, grupo);
  }

  @Mutation(() => QuizUnidadEditable, { name: 'guardarQuizUnidad' })
  guardarQuizUnidad(@Args('datos') datos: UpsertQuizUnidadInput, @Context() context: any) {
    this.alumnoService.requireRoles(context, [RolUsuario.MODERADOR, RolUsuario.ADMINISTRADOR]);
    return this.quizService.guardarQuizUnidad(datos);
  }

  @Mutation(() => QuizIntentoResultado, { name: 'registrarIntentoQuiz' })
  registrarIntentoQuiz(@Args('datos') datos: RegistrarIntentoQuizInput, @Context() context: any) {
    const usuario = this.alumnoService.getSessionUserFromContext(context);
    return this.quizService.registrarIntento(datos, usuario);
  }
}
