import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../../auth/auth.module';
import { MoongoseService } from '../../db/moongose.service';
import { EmptyLogger } from '../../tests/empty-logger';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('Users Sign Up', () => {
  let app;
  let module: TestingModule;
  let usersController: UsersController;
  let usersService: UsersService;
  let moongoseService: MoongoseService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();
    module.useLogger(new EmptyLogger());

    app = module.createNestApplication();
    await app.init();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
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

  it('should not return a users password', async () => {
    const user = await usersController.signUp({
      email: 'user2@gmail.com',
      password: '12345',
    });
    expect(user).not.toHaveProperty('password');
    expect(user).toMatchObject({ email: 'user2@gmail.com' });
  });

  it('should create a user with a encrypted password', async () => {
    const email = 'user3@gmail.com';
    const password = '12345';
    await usersController.signUp({
      email,
      password,
    });
    const user = await usersService.findOneByEmailWithPassword(email);
    expect(user.password).not.toBe(password);
  });

  it('should not create a user if already exists a user with the same email', async () => {
    await request(app.getHttpServer())
      .post('/users/signup')
      .send({
        email: 'user3@gmail.com',
        password: '12345',
      })
      .expect(500);
  });

  afterAll(async () => {
    module.close();
  });
});
