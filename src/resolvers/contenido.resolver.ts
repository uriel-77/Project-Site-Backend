// IMPORTS
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { Contenido, TipoContenido } from '../entities/contenido.entity';

@Resolver(() => Contenido)
export class ContenidoResolver {

    @Query(() => [Contenido], { name: 'contenidos' })
    async getContenidos() {
    // Datos de prueba
    return[{
            contenido_id: 1,
            titulo: 'Introduccion a compiladores',
            descripcion: 'Conceptos básicos de analizadores lexicos',
            tipo: TipoContenido.LECCION,
            unidad_id: 1,
        },
        {
            contenido_id: 2,
            titulo: 'Practica 1',
            descripcion: 'Subir el archivo .flex aqui',
            tipo: TipoContenido.TAREA,
            unidad_id: 1,
        },];
    }

    @Query(() => Contenido, { name: 'contenido', nullable: true })
    async getContenidoById(@Args('id', { type: () => Int }) id: number) {
        // Ejemplo de busqueda por ID
        return {
            contenido_id: id,
            titulo: 'Contenido específico',
            descripcion: 'Buscaste el ID ' + id,
            tipo: TipoContenido.RECURSO,
            unidad_id: 1,
        };
    }
}