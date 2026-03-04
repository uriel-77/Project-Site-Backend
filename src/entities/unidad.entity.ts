// IMPORTS
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Contenido } from './contenido.entity';

@ObjectType()
@Entity()
export class Unidad {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    nombre: string;

    @Field()
    @Column()
    descripcion: string;

    @Field(() => [Contenido], { nullable: true })
    @OneToMany(() => Contenido, (contenido) => contenido.unidad)
    contenidos: Contenido[];
}