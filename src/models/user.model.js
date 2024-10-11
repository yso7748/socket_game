import { Socket } from 'socket.io';
import redisClient from '../init/redis.js';

const USER_KEY_PREFIX = 'user';

export const addUser = async (user) => {
  await redisClient.set(`${USER_KEY_PREFIX}${user.uuid}`, JSON.stringify(user));
};

export const removeUser = async (uuid) => {
  const userKey = `${USER_KEY_PREFIX}${uuid}`;
  const user = await redisClient.get(userKey);
  if (user) {
    await redisClient.del(userKey);
    return JSON.parse(user);
  }
  return null;
};

export const getUsers = async () => {
  const keys = await redisClient.keys(`${USER_KEY_PREFIX}*`);
  const users = [];
  for (const key of keys) {
    const user = await redisClient.get(key);
    if (user) {
      users.push(JSON.parse(user));
    }
  }
  return users;
};

export const getUserById = async (uuid) => {
  const user = await redisClient.get(`${USER_KEY_PREFIX}${uuid}`);
  return user ? JSON.parse(user) : null;
};
