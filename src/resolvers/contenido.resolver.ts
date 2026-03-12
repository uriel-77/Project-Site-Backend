import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ContenidoService } from '../services/contenido.service';
import { Contenido } from '../entities/contenido.entity';

@Resolver(() => Contenido)
export class ContenidoResolver {
  // 1. Inyectamos el servicio para dejar de usar datos manuales
  constructor(private readonly contenidoService: ContenidoService) {}

  @Query(() => [Contenido], { name: 'contenidos' })
  findAll() {
    // 2. Llamamos al método real que consulta la base de datos
    return this.contenidoService.findAll();
  }

  @Query(() => Contenido, { name: 'contenido', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.contenidoService.findOne(id);
  }
}