import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../../auth/auth.module';
import { MoongoseService } from '../../db/moongose.service';
import { EmptyLogger } from '../../tests/empty-logger';
import { UsersController } from '../users.controller';

describe('Users Sign Up', () => {
  let app;
  let module: TestingModule;
  let usersController: UsersController;
  let moongoseService: MoongoseService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();
    module.useLogger(new EmptyLogger());

    app = module.createNestApplication();
    await app.init();

    usersController = module.get<UsersController>(UsersController);
    moongoseService = module.get<MoongoseService>(MoongoseService);
    moongoseService.cleanDatabase();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should sing up an user', async () => {
    const user = await usersController.signUp({
      email: 'user1@gmail.com',
      password: '12345',
    });
    expect(user).toMatchObject({ email: 'user1@gmail.com' });
  });

  it('should create a user with a encrypted password', async () => {
    const password = '12345';
    const user = await usersController.signUp({
      email: 'user2@gmail.com',
      password,
    });
    expect(user.password).not.toBe(password);
  });

  it('should not create a user if already exists a user with the same email', async () => {
    await request(app.getHttpServer())
      .post('/users/signup')
      .send({
        email: 'user2@gmail.com',
        password: '12345',
      })
      .expect(500);
  });

  afterAll(async () => {
    module.close();
  });
});
