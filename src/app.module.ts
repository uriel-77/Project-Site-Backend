// --- Imports generales ---
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

// --- Imports de resolvers y entidades ---
import { AlumnoResolver } from './resolvers/alumno.resolver';
import { ContenidoResolver } from './resolvers/contenido.resolver';

// --- Imports de servicios y módulos ---
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UnidadModule } from './unidad/unidad.module'; // Este ya trae su propio Resolver y Service
import { ContenidoService } from './services/contenido.service';

@Module({
  imports: [
    // Configuración de GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true, 
      introspection: true,
      plugins: [], 
    }),
    UnidadModule, // <--- Esto es lo único que necesitamos para las unidades
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    AlumnoResolver, 
    ContenidoResolver, 
    ContenidoService,
    // SE QUITÓ UnidadResolver de aquí para que no use el archivo viejo con datos falsos
  ],
})
export class AppModule {}