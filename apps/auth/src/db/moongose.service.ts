import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { IDatabaseService } from './db.service.interface';

@Injectable()
export class MoongoseService implements IDatabaseService {
  constructor(@InjectConnection() private connection: Connection) {}

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;
    this.connection.collection('users').drop();
  }
}
