// IMPORTS
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { ManyToOne } from 'typeorm';
import { Unidad } from './unidad.entity';

export enum TipoContenido {
    LECCION = 'leccion',
    RECURSO = 'recurso',
    TAREA = 'tarea',
}

registerEnumType(TipoContenido, {
    name: 'TipoContenido',
});

@ObjectType()
export class Contenido {
    @Field(() => ID)
    contenido_id: number;

    @Field()
    titulo: string;

    @Field()
    descripcion: string;

    @Field(() => TipoContenido)
    tipo: TipoContenido;

    @Field()
    unidad_id: number;

    @Field(() => Unidad, { nullable: true })
    @ManyToOne(() => Unidad, (unidad) => unidad.contenidos)
    unidad: Unidad;
}