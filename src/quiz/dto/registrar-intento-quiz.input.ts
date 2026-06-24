import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RegistrarIntentoQuizInput {
  @Field(() => Int)
  quizId: number;

  @Field(() => [Int])
  respuestasSeleccionadas: number[];
}
