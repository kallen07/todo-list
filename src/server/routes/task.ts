import express, { Router } from 'express';
import models from 'src/server/models';
import { Task } from 'src/types';

const router = Router();

// CREATE
// request type: src/types/task
// response: {"id": string}
router.post('/', async function(req: express.Request, res: express.Response) {
  const newTask = new models.Task({
    text: req.body.text,
    isDone: req.body.isDone,
    dateCreated: req.body.dateCreated,
  });

  await newTask.save();

  res.send({"id": newTask._id});
});

// READ
router.get('/', async function(req: express.Request, res: express.Response) {
  const dbTasks = await models.Task.find({});
  var tasks: Task[] = [];
  dbTasks.forEach((dbTask: any) => {
    tasks.push({
      id: dbTask._id,
      text: dbTask.text,
      isDone: dbTask.isDone,
      dateCreated: dbTask.dateCreated,
    });
  });
  res.send(tasks);
});

// UPDATE
// overwrites all task fields associated with a specific task id
// request type: src/types/task
// response: {"id": string}
router.put('/:taskId', async function(req: express.Request, res: express.Response) {
  const task: any = await models.Task.findById(req.params.taskId);
  if (task == null) {
    res.sendStatus(404);
    console.log("!!!! ERROR IN TASK UPDATE: could not find task with id: "+ req.body.id);
  } else {
    task.text = req.body.text;
    task.isDone = req.body.isDone;
    task.dateCreated = req.body.dateCreated,
    await task.save();
    res.send({"id": req.params.taskId});
  }
});

export default router;