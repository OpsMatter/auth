import mongoose from 'mongoose';
import config from 'config';

const databaseURL = `mongodb://${config.get('database.username')}:${config.get(
  'database.password'
)}@${
  process.env.NODE_ENV === 'development' ? 'localhost' : 'database'
}:27017/auth?authSource=admin`;

export const connect = async () => {
  try {
    await mongoose.connect(databaseURL);
    console.log('MongoDB client connected');
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connect, 5000);
  }
};
