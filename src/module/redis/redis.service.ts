import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  async set(key: string, value: string, t?: number): Promise<void> {
    try {
      if (t) {
        await this.redis.set(key, value, 'EX', t);
      } else {
        await this.redis.set(key, value);
      }
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }
  async get(key: string) {
    try {
      if (!(await this.exists(key))) throw new Error('key不存在');
      return await this.redis.get(key);
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }
  // 删除一个键
  async del(key: string): Promise<number> {
    try {
      if (!(await this.exists(key))) throw new Error('key不存在');
      return await this.redis.del(key);
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }
  // 检查某个键是否存在
  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result > 0; // 如果存在则返回 true
  }
  // 获取键的过期时间
  async ttl(key: string): Promise<number> {
    return await this.redis.ttl(key);
  }
  // 设置 Hash 类型的字段值
  async hset(hash: string, field: string, value: string): Promise<number> {
    return await this.redis.hset(hash, field, value);
  }
  // 获取 Hash 类型中的某个字段值
  async hget(hash: string, field: string): Promise<string | null> {
    return this.redis.hget(hash, field);
  }
  // 获取所有字段和值
  async hgetAll(hash: string): Promise<Record<string, string>> {
    return this.redis.hgetall(hash);
  }
  // 向队列中推送元素（Redis 列表类型）
  async rpush(queue: string, value: string): Promise<number> {
    return this.redis.rpush(queue, value);
  }
  // 从队列中弹出元素
  async lpop(queue: string): Promise<string | null> {
    return this.redis.lpop(queue);
  }
}
