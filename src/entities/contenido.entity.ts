import { ObjectType, Field, Int, ID, registerEnumType } from '@nestjs/graphql';
import { TipoContenido } from '@prisma/client'; // <-- IMPORTANTE: Traer el enum de Prisma
import { Unidad } from '../unidad/entities/unidad.entity';

// Registramos el enum para que GraphQL lo entienda
registerEnumType(TipoContenido, {
  name: 'TipoContenido',
});

@ObjectType()
export class Contenido {
  @Field(() => ID)
  id: number; // Cambiado de contenido_id a id (como en Prisma)

  @Field()
  titulo: string;

  @Field()
  descripcion: string;

  @Field(() => TipoContenido, { nullable: true }) 
  tipo?: TipoContenido;

  @Field(() => Int)
  unidadId: number; // Cambiado de unidad_id a unidadId (como en Prisma)

  @Field(() => Unidad, { nullable: true })
  unidad?: Unidad;
}