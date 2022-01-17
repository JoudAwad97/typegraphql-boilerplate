import { confirmUserPrefix } from "./../constants/redisPrefixes";
import { redis } from "src/redis";
import { v4 } from "uuid";

export const createConfirmationUrl = async (userId: number) => {
  const token = v4();
  await redis.set(confirmUserPrefix + token, userId, "ex", 60 * 60 * 24); // 1 day expiration

  return `http://localhost:3000/user/confirm/${token}`;
};
