import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache, Milliseconds, Store } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

@Injectable()
export class RedisService<S extends Store = Store> implements Cache {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  store: S;

  set = async (key: string, value: unknown, timeToLive?: Milliseconds) => {
    return this.cacheManager.set(key, value, {
      ttl: timeToLive,
    } as any);
  };
  get = async <T>(key: string): Promise<T | undefined> => {
    return this.cacheManager.get(key);
  };
  del = (key: string) => {
    return this.cacheManager.del(key);
  };
  update = async (key: string, newValue: unknown, time?: number) => {
    const old = await this.cacheManager.store.ttl(key);
    return await this.cacheManager.set(key, newValue, {
      ttl: time || old || Number(process.env['REDIS_TTL'] || 5 * 60 * 60),
    } as any);
  };
  reset = () => {
    return this.cacheManager.reset();
  };
  wrap<T>(key: string, fn: () => Promise<T>, ttl?: Milliseconds): Promise<T> {
    return this.cacheManager.wrap(key, fn);
  }
}
