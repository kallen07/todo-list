import express, { Router } from 'express';
import models from 'src/server/models';
import { Task } from 'src/types';

const router = Router();

// CREATE
// request type: src/types/task
// response type: src/types/task
router.post('/', async function(req: express.Request, res: express.Response) {
  const dbTask: any = new models.Task({
    text: req.body.text,
    isDone: req.body.isDone,
    dateCreated: req.body.dateCreated,
    dateCompleted: req.body.dateCompleted,
  });

  await dbTask.save();

  const task: Task = {
    id: dbTask._id,
    text: dbTask.text,
    isDone: dbTask.isDone,
    dateCreated: dbTask.dateCreated,
    dateCompleted: dbTask.dateCompleted,
  }
  res.send(task);
});

// READ
router.get('/', async function(req: express.Request, res: express.Response) {
  const dbTasks = await models.Task.find({});
  const tasks: Task[] = [];
  dbTasks.forEach((dbTask: any) => {
    tasks.push({
      id: dbTask._id,
      text: dbTask.text,
      isDone: dbTask.isDone,
      dateCreated: dbTask.dateCreated,
      dateCompleted: dbTask.dateCompleted,
    });
  });
  res.send(tasks);
});

// UPDATE
// overwrites all task fields associated with a specific task id
// request type: src/types/task
// response: type: src/types/task
router.put('/:taskId', async function(req: express.Request, res: express.Response) {
  const dbTask: any = await models.Task.findById(req.params.taskId);
  if (dbTask == null) {
    res.sendStatus(404);
    console.log("!!!! ERROR IN TASK UPDATE: could not find task with id: "+ req.body.id);
  } else {
    dbTask.text = req.body.text;
    dbTask.isDone = req.body.isDone;
    dbTask.dateCreated = req.body.dateCreated,
    dbTask.dateCompleted = req.body.dateCompleted,
    await dbTask.save();

    const task: Task = {
      id: dbTask._id,
      text: dbTask.text,
      isDone: dbTask.isDone,
      dateCreated: dbTask.dateCreated,
      dateCompleted: dbTask.dateCompleted,
    }
    res.send(task);
  }
});

// DELETE
router.delete('/', async function(req: express.Request, res: express.Response) {
  models.Task.deleteMany({_id: {$in: req.body}}, (err) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.sendStatus(200)
    }
  });
});

export default router;