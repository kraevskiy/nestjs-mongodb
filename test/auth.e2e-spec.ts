import { AuthDto } from '../src/auth/dto/auth.dto';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { disconnect } from 'mongoose';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from '../src/auth/auth.constans';

const loginDto: AuthDto = {
  login: 'test@t.com',
  password: 'test',
};

describe('AuthController user', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - success', async (done) => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body).toBeDefined();
        done();
      });
  });

  it('/auth/login (POST) - fail (PASSWORD)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: 'test1' })
      .expect(401, {
        statusCode: 401,
        message: WRONG_PASSWORD_ERROR,
        error: 'Unauthorized',
      });
  });

  it('/auth/login (POST) - fail (EMAIL)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, login: 'asd@asd.asd' })
      .expect(401, {
        statusCode: 401,
        message: USER_NOT_FOUND_ERROR,
        error: 'Unauthorized',
      });
  });

  afterAll(() => {
    disconnect();
  });
});
