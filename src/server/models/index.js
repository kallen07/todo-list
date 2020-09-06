import mongoose from 'mongoose';

import User from './user';
import Task from './task';

const connectDb = () => {
  return mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true });
  // change to process.env.DATABASE_URL
}

const models = { User, Task };

export { connectDb };

export default models;
