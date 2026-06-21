<<<<<<< HEAD
## Navegacion general

Sin sesion iniciada, la barra lateral muestra:

- `Cursos`
- `General`
- `Acceso`

Con sesion iniciada, la barra cambia segun el rol:

- `alumno`: acceso a `Panel del Alumno` y cursos
- `moderador`: acceso a `Panel de Moderacion` y cursos
- `administrador`: acceso a `Panel de Administracion` y cursos

## Flujos comunes para cualquier usuario

### 1. Pantalla de inicio

Validar:

- que cargue la vista `Inicio`;
- que el menu lateral responda en escritorio y movil;
- que los enlaces generales naveguen sin romper la app.

### 2. Acceso a cursos protegidos

Intentar abrir `Compiladores` o `Teoría de la Computación.` sin sesion.

Resultado esperado:

- la app debe redirigir a `Iniciar Sesion`.

### 3. Inicio de sesion

Desde `Iniciar Sesion`, validar:

- campos `Correo Electronico` y `Contrasena`;
- mensaje de error si falta algun dato;
- redireccion automatica al panel correcto segun el rol;
- persistencia de sesion al recargar;
- cierre de sesion desde el boton del panel o sidebar.

### 4. Secciones generales

Validar que sigan disponibles con y sin sesion:

- `Contacto`
- `Presentaciones`
- `Sobre Mi`
- `Tesis`

## Flujo de alumno

### Alta de cuenta

Ruta: `Registrarse`

Validar:

- captura de `nombre`, `apellido`, `email`, `password`, `confirmPassword` y `grupo`;
- error si faltan campos;
- error si el correo no es valido;
- error si la contrasena tiene menos de 6 caracteres;
- error si las contrasenas no coinciden;
- redireccion a `Iniciar Sesion` al registrarse correctamente.

Nota:

- el grupo se elige desde una lista fija: `TC-01`, `TC-02`, `TC-03`, `TC-04`.

### Panel del alumno

Ruta esperada despues de login: `Panel del Alumno`

Validar:

- nombre, apellido, correo y grupo visibles en cabecera;
- cambio entre `Parcial 1`, `Parcial 2` y `Parcial 3`;
- carga de asignaciones filtradas por grupo y parcial;
- resumen con total de actividades, entregadas y porcentaje total;
- estado por actividad: `Pendiente`, `Entregada` o `No Aplica`.

### Entrega de actividades

Dentro del checklist del parcial:

- abrir una actividad entregable;
- usar `Subir`;
- seleccionar archivo valido;
- enviar entrega.

Validar:

- que se acepte solo archivo de hasta `10 MB`;
- tipos permitidos: `PDF`, `DOC`, `DOCX`, `XLS`, `XLSX`, `ZIP`, `TXT`, `JPG`, `PNG`;
- que despues de entregar cambie el estado a `Entregada`;
- que se muestre el nombre del archivo enviado;
- que no aparezca el boton de subida para una actividad ya entregada.

### Consulta de cursos

Como alumno autenticado, validar:

- acceso a `Compiladores` y `Teoría de la Computación.`;
- cambio entre `Periodo 1`, `Periodo 2` y `Periodo 3`;
- descarga de documentos visibles;
- apertura del modal de `Evaluaciones de Reposicion`;
- listado de unidades y lecciones del `Guion Didactico`;
- entrada a una leccion individual y regreso al curso.

Observacion:

- algunas descargas y accesos son demostrativos o dependen de archivos/backend disponibles.

## Flujo de moderador

### Acceso

Ruta esperada despues de login: `Panel de Moderacion`

Validar:

- cabecera con nombre del usuario;
- boton de `Cerrar sesion`;
- carga del modulo `Moderacion de contenidos`.

### Gestion de contenidos

El moderador puede trabajar por materia desde el selector superior.

Validar:

- cambio de materia;
- carga del catalogo actual;
- recarga manual con `Recargar`.

### CRUD de unidades

Validar:

- crear unidad;
- editar unidad;
- eliminar unidad;
- reflejo inmediato en el catalogo.

### CRUD de temas

Validar:

- seleccionar unidad;
- crear tema con titulo, descripcion, tipo, orden, URL y bloques de contenido;
- editar tema;
- eliminar tema.

### CRUD de videos

Validar:

- asociar video a un tema;
- capturar `youtubeUrl`;
- asignar tipos (`APRENDIZAJE`, `ACTIVIDAD`, `OTRO`);
- vincularlo con asignaciones del mismo tema cuando existan;
- editar y eliminar video.

### CRUD de asignaciones

Validar:

- asociar asignacion a un tema;
- definir `periodo`, `porcentaje`, `orden`, `grupo` y `rubrica`;
- vincular videos;
- editar y eliminar asignacion.

Puntos a revisar en pruebas:

- que una asignacion del grupo correcto aparezca luego en el panel del alumno;
- que los videos vinculados se vean dentro de la actividad del alumno;
- que los mensajes de exito y error sean claros.

## Flujo de administrador

### Acceso

Ruta esperada despues de login: `Panel de Administracion`

Validar:

- KPIs de cantidad de `alumnos`, `moderadores` y `administradores`;
- tabs `Usuarios`, `Calificaciones` y `Contenidos`;
- cierre de sesion correcto.

### Tab de usuarios

El administrador puede crear, editar y eliminar cuentas.

Validar:

- alta de usuario con nombre, apellido, correo, password, grupo, rol y estado;
- edicion sin obligar a cambiar password;
- cambio de rol entre `Alumno`, `Moderador` y `Administrador`;
- cambio de estado `activo` e `inactivo`;
- eliminacion de usuario;
- actualizacion de la tabla despues de cada operacion.

Casos recomendados:

- crear un `moderador` nuevo y verificar que pueda iniciar sesion;
- crear un `alumno` nuevo y verificar que aparezca asociado a su grupo;
- marcar un usuario como `inactivo` y validar el comportamiento del backend si aplica.

### Tab de calificaciones

El administrador puede calificar entregas por grupo y por parcial.

Validar:

- seleccion de grupo;
- carga de alumnos del grupo;
- carga de asignaciones;
- captura y guardado de calificacion por asignacion;
- persistencia al recargar la vista.

Este flujo depende de que antes existan:

- alumnos en el grupo;
- asignaciones publicadas;
- entregas registradas por alumnos.

### Tab de contenidos

El administrador comparte el mismo modulo de gestion de contenidos que el moderador.

Videos a agregar

unidad 5 IMplementador de un analizador sintactico
https://www.youtube.com/embed/xdEAPpk-oGI?si=Vff0-LMHUfAhIIiR

Unidad 2 Automatas finitos
https://www.youtube.com/embed/mm30LqoW5XA?si=X6Fx9mBSoHZYt9rX

Tema 7: DEFINICIÓN DE AFD Y SUS DOS REQUISITOS 
https://www.youtube.com/embed/aWelqKymPAw?si=IdUigL4PACtE2oPg

MÉTODOS FORMALES Y NO FORMALES
https://www.youtube.com/embed/J8PUT33woko?si=fVJjKvgYZGZsRuyu

Reto de programación 2 Didacmax2000 
https://www.youtube.com/embed/4z4VXNP2-nU?si=K990yuoookJ3avIS

Presentacion Curso Compiladores UPIICSA
https://www.youtube.com/embed/2lpBQe6DYHA?si=YnusCr-m3uDVT7LO

Presentacion de diferencias
https://www.youtube.com/embed/tTxN9hTJ--c?si=gKLU_2DPJXkWgszg

Automatas finitos
https://www.youtube.com/embed/poBW6RzN1F0?si=qRx7BHrBaYithCl0
=======
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Local backend

El proyecto ya incluye un archivo `.env` local listo para arrancar usando la base de Railway:

```bash
DATABASE_URL="postgresql://postgres:TU_PASSWORD@mainline.proxy.rlwy.net:37629/railway"
PORT=3001
NODE_ENV=development
```

Pasos para levantarlo localmente usando Railway:

```bash
# 1. Arrancar el backend
$ npm run start
```

Notas:

- `npm run start` ahora usa `nest start`, por lo que ya no depende de tener `dist/` compilado antes.
- Si quieres usar PostgreSQL local en Docker, cambia `DATABASE_URL` en `.env` por:

```bash
DATABASE_URL="postgresql://postgres:password123@127.0.0.1:5433/ipn_lms?schema=public"
```

Luego ejecuta:

```bash
$ npm run db:up
$ npx prisma migrate deploy
$ npm run db:seed
$ npm run start
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

### Railway

Variables requeridas en producción:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME
NODE_ENV=production
```

Variables alternativas compatibles:

```bash
DATABASE_PRIVATE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME
# o variables PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD
```

Notas de despliegue:

- Railway debe exponer `PORT`; la app ya lo toma automáticamente.
- El servicio ahora arranca con `node dist/main`, no con `nest start`.
- Si `DATABASE_URL` no existe, la app fallará con un error explícito en vez de intentar conectarse a `localhost:5432`.
- Si usas PostgreSQL de Railway, vincula la base al servicio backend para que inyecte `DATABASE_URL`.
- En Railway no uses `localhost`, `127.0.0.1` ni `::1` como host de Postgres. Debes usar la URL privada/pública del servicio PostgreSQL vinculado.

Variables recomendadas en Railway:

```bash
# Backend
DATABASE_URL=${{ Postgres.DATABASE_URL }}
NODE_ENV=production

# Frontend compiladores
REACT_APP_GRAPHQL_API_URL=https://project-site-backend-production.up.railway.app/graphql
REACT_APP_USE_MOCK_GUION=false
```

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
>>>>>>> feature/schema-entregas-archivos
