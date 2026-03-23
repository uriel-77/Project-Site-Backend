// --- Imports generales ---
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

// --- Imports de servicios y módulos nuevos ---
import { PrismaModule } from './prisma/prisma.module';
import { RubricaModule } from './rubrica/rubrica.module';
import { InsigniaModule } from './insignia/insignia.module';

// --- Imports de modulos existentes ---
import { UnidadModule } from './unidad/unidad.module';

// --- Otros resolvers y servicios ---
import { AlumnoResolver } from './resolvers/alumno.resolver';
import { ContenidoResolver } from './resolvers/contenido.resolver';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContenidoService } from './services/contenido.service';

@Module({
  imports: [
    // 1. Modulos de datos y lógica
    PrismaModule,     // Conexion DB
    RubricaModule,    // Rúbricas
    InsigniaModule,   // Insignias
    UnidadModule,     // Unidad

    // 2. Configuracion de GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true, 
      introspection: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    AlumnoResolver, 
    ContenidoResolver, 
    ContenidoService,
  ],
})
export class AppModule {}