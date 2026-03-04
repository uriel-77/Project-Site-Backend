// --- Imports generales ---
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

// --- Imports de resolvers y entidades ---
import { Alumno } from './entities/alumno.entity';
import { Contenido } from './entities/contenido.entity';
import { Unidad } from './entities/unidad.entity';
import { AlumnoResolver } from './resolvers/alumno.resolver';
import { ContenidoResolver } from './resolvers/contenido.resolver';
import { UnidadResolver } from './resolvers/unidad.resolver';

// --- Imports de servicios ---
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Conexion principal (Supabase)
    /*
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: host_supabase', 
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'postgres',
      entities: [Alumno, Contenido, Unidad],
      synchronize: true, 
    }),
    */

    // Registro de entidades
    // TypeOrmModule.forFeature([Alumno, Contenido, Unidad]),

    // Configuracion de GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true, 
      introspection: true,
      plugins: [], 
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    AlumnoResolver, 
    ContenidoResolver, 
    UnidadResolver
  ],
})
export class AppModule {}