import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../auth.module';
import * as request from 'supertest';

describe('User Sign In', () => {
  let app: INestApplication;
  let access_token: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should signin (/POST signin)', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ username: 'abner', password: '12345' })
      .expect(201);
    expect(res.body).toHaveProperty('access_token');

    access_token = res.body.access_token;
  });

  it('should have access after signin', async () => {
    await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);
  });

  afterAll(async () => {
    app.close();
  });
});
