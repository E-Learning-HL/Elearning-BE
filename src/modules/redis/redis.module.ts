import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';
@Module({
  providers: [RedisService],
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      store: redisStore,
      host: String(process.env['REDIS_HOST']) || 'localhost',
      port: Number(process.env['REDIS_PORT']) || 6372,
      ttl: Number(process.env['REDIS_TTL']) || undefined,
      auth_pass: process.env['REDIS_PASS'] || 'abc',
      password: process.env['REDIS_PASS'] || 'abc',
    }),
  ],
  exports: [RedisService],
})
export class RedisModule {}
