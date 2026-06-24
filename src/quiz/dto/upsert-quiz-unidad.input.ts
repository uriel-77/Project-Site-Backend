import { Field, InputType, Int } from '@nestjs/graphql';
import { TipoMateria } from '../../contenido/entities/contenido.entity';

@InputType()
export class QuizPreguntaDraftInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field()
  enunciado: string;

  @Field(() => [String])
  opciones: string[];

  @Field(() => Int)
  respuestaCorrectaIndex: number;

  @Field({ nullable: true })
  explicacion?: string;

  @Field(() => Int)
  orden: number;
}

@InputType()
export class UpsertQuizUnidadInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int)
  unidadId: number;

  @Field(() => TipoMateria)
  tipoMateria: TipoMateria;

  @Field()
  titulo: string;

  @Field({ nullable: true })
  descripcion?: string;

  @Field()
  publicado: boolean;

  @Field(() => [QuizPreguntaDraftInput])
  preguntas: QuizPreguntaDraftInput[];
}
