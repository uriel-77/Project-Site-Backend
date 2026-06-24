import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AlumnoModule } from '../alumno/alumno.module';
import { QuizResolver } from './quiz.resolver';
import { QuizService } from './quiz.service';

@Module({
  imports: [PrismaModule, AlumnoModule],
  providers: [QuizResolver, QuizService],
  exports: [QuizService],
})
export class QuizModule {}
