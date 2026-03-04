// IMPORTS
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Contenido } from './contenido.entity';

@ObjectType({ description: 'Entidad que representa a un alumno del sistema' })
@Entity()
export class Alumno {
    @Field(() => Int) 
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    nombre: string;

    @Field()
    @Column()
    email: string;

    @Field(() => [Contenido], { nullable: true })
    @ManyToMany(() => Contenido)
    @JoinTable()
    contenidosCompletados: Contenido[];
}