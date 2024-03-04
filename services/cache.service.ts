import { createClient, RedisClientType, RedisFunctions, RedisModules, RedisScripts } from "redis";
import secrets from "../constants/secrets.const";

class RedisCache {
  client: undefined | RedisClientType<RedisModules, RedisFunctions, RedisScripts>;
  ONE_DAY: number;

  private async connectRedis() {
    const client = createClient({
      password: secrets.redis.password,
      socket: {
        host: secrets.redis.host,
        port: secrets.redis.port as number,
      },
    });

    const connection = await client.connect();
    this.client = connection;
    return connection;
  }

  constructor() {
    this.client = undefined;
    this.ONE_DAY = 60 * 60 * 24;
  }

  public async set<T = unknown>(key: string, value: T): Promise<string | null> {
    this.client = this.client || (await this.connectRedis());

    if (typeof value === "object" || value instanceof Buffer) {
      value = JSON.stringify(value) as T;
    }

    return await this.client.set(key, value as Buffer, { EX: this.ONE_DAY });
  }

  public async get<T>(key: string): Promise<T | null> {
    this.client = this.client || (await this.connectRedis());

    let data = await this.client.get(key);

    if (!data) return null;
    try {
      data = JSON.parse(data as string);
    } catch (error) {
      data = data;
    }

    return data as T;
  }

  public async delete(key: string): Promise<void> {
    this.client = this.client || (await this.connectRedis());

    await this.client?.del(key);
  }
}

const redisCache = new RedisCache();
export default redisCache;
