import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../../auth/auth.module';
import { UsersController } from '../users.controller';

describe('Users Sign Up', () => {
  let module: TestingModule;
  let usersController: UsersController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should sing up an user', async () => {
    const user = await usersController.signUp({
      email: 'abner',
      password: '12345',
    });
    expect(user).toMatchObject({ email: 'abner' });
  });

  it('should create a user with a encrypted password', async () => {
    const password = '12345';
    const user = await usersController.signUp({
      email: 'abner',
      password,
    });
    expect(user.password).not.toBe(password);
  });

  afterAll(async () => {
    module.close();
  });
});
