import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { CreateProductDto } from '../src/product/dto/create-product.dto';
import { FindProductDto } from '../src/product/dto/find-product.dto';

const testDto: CreateProductDto = {
  'image': '55.png',
  'title': 'New product patch5555',
  'price': 100,
  'oldPrice': 120,
  'credit': 10,
  'description': 'description',
  'advantages': 'advantages',
  'disAdvantages': 'disAdvantages',
  'categories': ['test'],
  'tags': ['tag1'],
  'characteristics': [
    {
      'name': 'name 1sdf',
      'value': '1asdfadf',
    },
    {
      'name': 'name 2sdf',
      'value': '2sdf',
    },
  ],
};

const loginDto: AuthDto = {
  login: 'test@t.com',
  password: 'test',
};

const findDto: FindProductDto = {
  category: 'test',
  limit: 5
}

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;
  let createdProduct: CreateProductDto;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);
    token = body.access_token;
  });

  it('/product/create (POST) - success', async (done) => {
    return request(app.getHttpServer())
      .post('/product/create')
      .set('Authorization', 'Bearer ' + token)
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdProduct = body;
        createdId = body._id;
        expect(createdId).toBeDefined();
        done();
      });
  });

  it('/product/create (POST) - fail token', async (done) => {
    return request(app.getHttpServer())
      .post('/product/create')
      .send({ ...testDto, title: 'some new' })
      .expect(401)
      .then(({ body }: request.Response) => {
        done();
      });
  });

  it('/product/:id (GET) - success', async (done) => {
    return request(app.getHttpServer())
      .get('/product/' + createdId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.title).toBe(createdProduct.title);
        done();
      });
  });

  it('/product/:id (GET) - fail token', () => {
    return request(app.getHttpServer())
      .get('/product/' + createdId)
      .expect(401);
  });

  it('/product/:id (PATCH) - success', async (done) => {
    return request(app.getHttpServer())
      .patch('/product/' + createdId)
      .set('Authorization', 'Bearer ' + token)
      .send({ ...testDto, price: 200 })
      .expect(200)
      .then(({ body }: request.Response) => {
        // @ts-ignore
        expect(body._id).toBe(createdProduct._id);
        done();
      });
  });

  it('/product/find (POST) - success', async (done) => {
    return request(app.getHttpServer())
      .post('/product/find')
      .send(findDto)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined()
        done()
      });
  });

  it('/product/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete('/product/' + createdId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });

  afterAll(() => {
    disconnect();
  });
});
