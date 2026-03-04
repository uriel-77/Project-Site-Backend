// IMPORTS
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Alumno } from '../entities/alumno.entity';

@Resolver(() => Alumno)
export class AlumnoResolver{
    
    @Query(() => [Alumno], { name: 'alumnos' })
    getAlumnos(){
        return [
            { id: 1, nombre: 'Ignacio Herrera', email: 'nacho@ejemplo.com' },
            { id: 2, nombre: 'Ricardo Aguas', email: 'richi@ejemplo.com' }
        ];
    }
    
    @Mutation(() => Alumno, { nullable: true })
    async completarContenido(
        @Args('alumnoId', { type: () => Int }) alumnoId: number,
        @Args('contenidoId', { type: () => Int }) contenidoId: number,
    ){
        console.log(`El alumno ${alumnoId} completo el contenido ${contenidoId}`);
        return null; 
    }
}