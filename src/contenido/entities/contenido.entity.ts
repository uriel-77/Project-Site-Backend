import { ObjectType, Field, Int, ID, registerEnumType } from '@nestjs/graphql';
import { Unidad } from '../../unidad/entities/unidad.entity';

export enum TipoContenido {
  LECCION = 'LECCION',
  RECURSO = 'RECURSO',
  TAREA = 'TAREA',
}

export enum TipoMateria {
  COMPILADORES = 'COMPILADORES',
  TEORIA_DE_LA_COMPUTACION = 'TEORIA_DE_LA_COMPUTACION',
  TEORIA_DE_LENGUAJES = 'TEORIA_DE_LENGUAJES',
}

registerEnumType(TipoContenido, {
  name: 'TipoContenido',
});

registerEnumType(TipoMateria, {
  name: 'TipoMateria',
});

@ObjectType()
export class Contenido {
  @Field(() => ID)
  id: number;

  @Field()
  titulo: string;

  @Field()
  descripcion: string;

  @Field(() => TipoContenido, { nullable: true })
  tipo?: TipoContenido;

  @Field(() => TipoMateria)
  tipoMateria: TipoMateria;

  @Field(() => Int)
  orden: number;

  @Field({ nullable: true })
  url_recurso?: string;

  @Field(() => [String])
  contenido: string[];

  @Field(() => Int)
  unidadId: number;

  @Field(() => Unidad, { nullable: true })
  unidad?: Unidad;
}
