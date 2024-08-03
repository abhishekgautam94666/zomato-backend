import { Redis } from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.PORT,
  password: process.env.REDIS_PASSWORD,
});

redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

export default redis;

// rdis user red-cqmvhro8fa8c73aivkmg
