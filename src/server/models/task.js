import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User,'
    },
    text: {
      type: String,
      required: true,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
  }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
