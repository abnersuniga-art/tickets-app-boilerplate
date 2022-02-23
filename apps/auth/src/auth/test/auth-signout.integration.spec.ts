import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoongoseService } from '../../db/moongose.service';
import { AuthModule } from '../auth.module';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

describe('Auth Sign Out', () => {
  let app: INestApplication;
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

  it('should sign out (/POST signout)', async () => {
    // signup user
    await request(app.getHttpServer()).post('/users/signup').send({
      email: 'user@gmail.com',
      password: '12345',
    });

    // signin user
    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'user@gmail.com', password: '12345' })
      .expect(201);
    expect(res.headers).toHaveProperty('set-cookie');
    const cookie = res.headers['set-cookie'];

    await request(app.getHttpServer())
      .post('/auth/signout')
      .set('cookie', cookie)
      .send()
      .expect(201);
  });
});
