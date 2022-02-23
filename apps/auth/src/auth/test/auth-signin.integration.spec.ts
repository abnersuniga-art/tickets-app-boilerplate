import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../auth.module';
import * as request from 'supertest';
import { MoongoseService } from '../../db/moongose.service';
import * as cookieParser from 'cookie-parser';

describe('Auth Sign In', () => {
  let app: INestApplication;
  let cookie: string;
  let moongoseService: MoongoseService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = module.createNestApplication();
    // needed to parse the jwt in the cookies
    app.use(cookieParser());
    await app.init();

    moongoseService = module.get<MoongoseService>(MoongoseService);
    moongoseService.cleanDatabase();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should signin (/POST signin)', async () => {
    // signup user
    await request(app.getHttpServer()).post('/users/signup').send({
      email: 'user@gmail.com',
      password: '12345',
    });

    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'user@gmail.com', password: '12345' })
      .expect(201);
    expect(res.headers).toHaveProperty('set-cookie');
    cookie = res.headers['set-cookie'];
  });

  it('should have access after signin', async () => {
    await request(app.getHttpServer())
      .get('/auth/profile')
      .set('cookie', cookie)
      .expect(200);
  });

  afterAll(async () => {
    app.close();
  });
});
