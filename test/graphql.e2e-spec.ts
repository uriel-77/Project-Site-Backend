import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { createHash, randomBytes, createCipheriv } from 'crypto';
import request from 'supertest';
import { AppModule } from '../src/app.module';

process.env.NODE_ENV = 'test';
process.env.AUTH_SECRET = process.env.AUTH_SECRET ?? 'test-auth-secret';
process.env.AUTH_TRANSPORT_SECRET =
  process.env.AUTH_TRANSPORT_SECRET ?? 'local-dev-transport-secret-2025';

type GraphQlResponse<T = any> = {
  body: {
    data?: T;
    errors?: Array<{ message: string }>;
  };
};

describe('GraphQL API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const gql = <T = any>(query: string, variables?: Record<string, unknown>, token?: string) => {
    const req = request(app.getHttpServer())
      .post('/graphql')
      .set('content-type', 'application/json');

    if (token) {
      req.set('authorization', `Bearer ${token}`);
    }

    return req.send({ query, variables }) as Promise<GraphQlResponse<T>>;
  };

  const encryptPassword = (password: string) => {
    const key = createHash('sha256')
      .update(process.env.AUTH_TRANSPORT_SECRET as string)
      .digest();
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(password, 'utf8'), cipher.final()]);
    const payload = Buffer.concat([encrypted, cipher.getAuthTag()]);

    return `enc::${iv.toString('base64')}::${payload.toString('base64')}`;
  };

  it('responde ping', async () => {
    const response = await gql<{ ping: string }>('query { ping }');

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data?.ping).toBe('pong');
  });

  it('bloquea consultas administrativas sin token', async () => {
    const response = await gql('query { usuarios { id email rol } }');

    expect(response.body.data).toBeNull();
    expect(response.body.errors?.[0]?.message).toContain('No se envio un token');
  });

  it('permite iniciar sesión con contraseña cifrada y consultar usuarios como administrador', async () => {
    const login = await gql<{
      iniciarSesion: { token: string; usuario: { email: string; rol: string } };
    }>(
      `mutation($datos: LoginAlumnoInput!) {
        iniciarSesion(datos: $datos) {
          token
          usuario { email rol }
        }
      }`,
      {
        datos: {
          email: 'admin@ipn.mx',
          password: encryptPassword('Admin123!'),
        },
      },
    );

    expect(login.body.errors).toBeUndefined();
    expect(login.body.data?.iniciarSesion.usuario).toMatchObject({
      email: 'admin@ipn.mx',
      rol: 'ADMINISTRADOR',
    });

    const usuarios = await gql<{ usuarios: Array<{ id: number; email: string; rol: string }> }>(
      'query { usuarios { id email rol } }',
      undefined,
      login.body.data?.iniciarSesion.token,
    );

    expect(usuarios.body.errors).toBeUndefined();
    expect(usuarios.body.data?.usuarios.length).toBeGreaterThan(0);
    expect(usuarios.body.data?.usuarios.some((usuario) => usuario.email === 'admin@ipn.mx')).toBe(
      true,
    );
  });

  it('permite a moderador consultar grupos pero no consultar usuarios', async () => {
    const login = await gql<{
      iniciarSesion: { token: string; usuario: { email: string; rol: string } };
    }>(
      `mutation($datos: LoginAlumnoInput!) {
        iniciarSesion(datos: $datos) {
          token
          usuario { email rol }
        }
      }`,
      {
        datos: {
          email: 'moderador1@ipn.mx',
          password: encryptPassword('Moderador123!'),
        },
      },
    );

    const token = login.body.data?.iniciarSesion.token;

    expect(login.body.errors).toBeUndefined();
    expect(login.body.data?.iniciarSesion.usuario.rol).toBe('MODERADOR');

    const grupos = await gql<{ grupos: string[] }>('query { grupos }', undefined, token);
    expect(grupos.body.errors).toBeUndefined();
    expect(Array.isArray(grupos.body.data?.grupos)).toBe(true);

    const usuarios = await gql('query { usuarios { id } }', undefined, token);
    expect(usuarios.body.data).toBeNull();
    expect(usuarios.body.errors?.[0]?.message).toContain('No tienes permisos');
  });
});
