import { User } from '../schemas/user.schema';

export class GetUserDto {
  name: string;
  email: string;

  constructor(user: Partial<User>) {
    this.name = user.name;
    this.email = user.email;
  }
}
