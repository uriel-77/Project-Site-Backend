import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { TipoMateria } from '../../contenido/entities/contenido.entity';

@ObjectType()
export class QuizPregunta {
  @Field(() => Int)
  id: number;

  @Field()
  enunciado: string;

  @Field(() => [String])
  opciones: string[];

  @Field(() => Int)
  orden: number;
}

@ObjectType()
export class QuizPreguntaEditable extends QuizPregunta {
  @Field(() => Int)
  respuestaCorrectaIndex: number;

  @Field({ nullable: true })
  explicacion?: string;
}

@ObjectType()
export class QuizUnidad {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  unidadId: number;

  @Field()
  unidadNombre: string;

  @Field(() => TipoMateria)
  tipoMateria: TipoMateria;

  @Field()
  titulo: string;

  @Field({ nullable: true })
  descripcion?: string;

  @Field()
  publicado: boolean;

  @Field(() => Int)
  totalPreguntas: number;

  @Field(() => [QuizPregunta])
  preguntas: QuizPregunta[];
}

@ObjectType()
export class QuizUnidadEditable {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  unidadId: number;

  @Field()
  unidadNombre: string;

  @Field(() => TipoMateria)
  tipoMateria: TipoMateria;

  @Field()
  titulo: string;

  @Field({ nullable: true })
  descripcion?: string;

  @Field()
  publicado: boolean;

  @Field(() => [QuizPreguntaEditable])
  preguntas: QuizPreguntaEditable[];
}

@ObjectType()
export class QuizIntento {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  quizId: number;

  @Field(() => Int)
  alumnoId: number;

  @Field(() => Int)
  aciertos: number;

  @Field(() => Int)
  totalPreguntas: number;

  @Field(() => Float)
  porcentaje: number;

  @Field()
  completadoEn: Date;
}

@ObjectType()
export class QuizRevisionRespuesta {
  @Field(() => Int)
  preguntaId: number;

  @Field(() => Int, { nullable: true })
  respuestaSeleccionada?: number | null;

  @Field(() => Int)
  respuestaCorrectaIndex: number;

  @Field()
  esCorrecta: boolean;

  @Field({ nullable: true })
  explicacion?: string;
}

@ObjectType()
export class QuizIntentoResultado {
  @Field(() => QuizIntento)
  intento: QuizIntento;

  @Field(() => [QuizRevisionRespuesta])
  revisiones: QuizRevisionRespuesta[];
}

@ObjectType()
export class QuizDominioUnidad {
  @Field(() => Int)
  quizId: number;

  @Field(() => Int)
  unidadId: number;

  @Field()
  unidadNombre: string;

  @Field()
  titulo: string;

  @Field(() => Int)
  intentos: number;

  @Field(() => Float)
  porcentajeMejor: number;

  @Field(() => Float)
  porcentajeUltimo: number;

  @Field({ nullable: true })
  completadoEn?: Date;
}

@ObjectType()
export class QuizRendimientoAlumno {
  @Field(() => Int)
  alumnoId: number;

  @Field()
  nombre: string;

  @Field()
  apellido: string;

  @Field()
  grupo: string;

  @Field(() => Int)
  quizzesCompletados: number;

  @Field(() => Int)
  totalQuizzes: number;

  @Field(() => Float)
  promedioDominio: number;

  @Field(() => [QuizDominioUnidad])
  unidades: QuizDominioUnidad[];
}
