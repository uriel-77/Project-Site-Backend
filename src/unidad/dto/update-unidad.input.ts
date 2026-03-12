import { CreateUnidadInput } from './create-unidad.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUnidadInput extends PartialType(CreateUnidadInput) {
  @Field(() => Int)
  id: number;
}
