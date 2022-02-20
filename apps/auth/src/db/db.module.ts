import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoongoseService } from './moongose.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoConfig } from '../../config/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const { user, password, host, port, db } =
          configService.get<MongoConfig>('database');
        return {
          uri: `mongodb://${user}:${password}@${host}:${port}/${db}`,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MoongoseService],
})
export class DbModule {}
