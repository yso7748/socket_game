import Redis from 'ioredis';

const redisClient = new Redis({
  host: 'localhost',
  port: 6379,
  // password: '' // 비밀번호가 필요한 경우 사용
});

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

export default redisClient;
