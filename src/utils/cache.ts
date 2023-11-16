import { createClient } from 'redis';

const redisURL = `redis://${
  process.env.NODE_ENV === 'development' ? 'localhost' : 'cache'
}:6379`;
export const client = createClient({ url: redisURL });

export const connect = async () => {
  try {
    await client.connect();
    console.log('Redis client connected');
  } catch (err: any) {
    console.log(err.message);
    setTimeout(connect, 5000);
  }
};

client.on('error', err => console.log(err));
