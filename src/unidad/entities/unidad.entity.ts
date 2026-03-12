import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Contenido } from '../../entities/contenido.entity'; // Importamos la otra entidad

@ObjectType()
export class Unidad {
  @Field(() => Int)
  id: number;

  @Field()
  nombre: string;

  // Aquí está la magia: le decimos que puede devolver un arreglo de Contenidos
  @Field(() => [Contenido], { nullable: true })
  contenidos?: Contenido[];
}