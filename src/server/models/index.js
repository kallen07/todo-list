import mongoose from 'mongoose';

import User from './user';
import Task from './task';

const connectDb = () => {
  return mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
  // changed from 'mongodb://localhost:27017/mydb' to process.env.DATABASE_URL
}

const models = { User, Task };

export { connectDb };

export default models;
