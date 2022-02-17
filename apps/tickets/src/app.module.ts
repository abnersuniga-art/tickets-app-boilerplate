import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:root@localhost:27017/tickets'),
  ],
  controllers: [AppController, CatsController],
  providers: [AppService],
})
export class AppModule {}
