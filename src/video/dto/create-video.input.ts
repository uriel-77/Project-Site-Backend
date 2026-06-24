import { Field, InputType, Int } from '@nestjs/graphql';
import { TipoVideo } from '../entities/video.entity';
import { TipoMateria } from '../../contenido/entities/contenido.entity';

@InputType()
export class CreateVideoInput {
  @Field()
  titulo: string;

  @Field({ defaultValue: '' })
  descripcion: string;

  @Field()
  youtubeUrl: string;

  @Field(() => [TipoVideo])
  tipos: TipoVideo[];

  @Field(() => TipoMateria, { nullable: true })
  tipoMateria?: TipoMateria;

  @Field(() => Int, { nullable: true })
  contenidoId?: number;

  @Field(() => [Int], { defaultValue: [] })
  asignacionIds: number[];

  @Field({ defaultValue: true })
  publicado: boolean;
}
