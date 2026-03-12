import { Module } from '@nestjs/common';
import { UnidadService } from './unidad.service';
import { UnidadResolver } from './unidad.resolver';

@Module({
  providers: [UnidadResolver, UnidadService],
})
export class UnidadModule {}
