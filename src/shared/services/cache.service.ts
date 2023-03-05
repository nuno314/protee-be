// import { redisDelByPattern, RedisDeletionMethod } from '@eturino/ioredis-del-by-pattern';
// import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
// import { Cache, Store } from 'cache-manager';

// export interface IRedisCache extends Cache {
//     store: RedisStore;
// }

// interface RedisStore extends Store {
//     name: 'redis';
//     getClient: () => any;
//     isCacheableValue: (value: any) => boolean;
// }

// @Injectable()
// export class CacheService {
//     private _client: any;
//     constructor(@Inject(CACHE_MANAGER) private cache: IRedisCache, @Inject(CACHE_MANAGER) private _cacheManager: Cache) {
//         this._client = cache.store.getClient();
//     }

//     async get<T>(key: string): Promise<T> {
//         return await this._cacheManager.get<T>(key);
//     }

//     // return 'OK' if success
//     async set(key: string, value: any, ttl = 0): Promise<string> {
//         return await this._cacheManager.set(key, value, { ttl: ttl });
//     }

//     // return number of deleted items
//     async delete(key: string): Promise<boolean> {
//         await this._cacheManager.del(key);
//         return true;
//     }

//     // return number of deleted items
//     // async multiDelete(keys: string[]): Promise<number> {
//     //     return await this._cacheManager.del.apply(redis, keys);
//     // }

//     // return number of deleted items
//     async deleteByPrefix(prefix: string): Promise<number> {
//         return await redisDelByPattern({
//             pattern: `${prefix}*`,
//             redis: this._client,
//             deletionMethod: RedisDeletionMethod.unlink,
//             withPipeline: true,
//         });
//     }
// }
