import express from 'express';
import path from 'path';
import models, { connectDb } from './../models';
import "regenerator-runtime/runtime.js";

const app: express.Application = express();

app.use(express.static(__dirname));

app.get('/', function (req: express.Request, res: express.Response) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/todos', async function(req: express.Request, res: express.Response) {
  const tasks = await models.Task.find({});
  res.send(tasks);
});


const eraseDatabaseOnSync = true;

connectDb().then( async () => {
  if (eraseDatabaseOnSync) {
    await Promise.all([
      models.User.deleteMany({}),
      models.Task.deleteMany({}),
    ]);
    
    seedDatabase();
  }

  app.listen(3000, function () {
    console.log("App is listening on port 3000!");
  });
});

const seedDatabase = async() => {
  const task1 = new models.Task({
    text: "walk dog",
    isDone: false,
    dateCreated: new Date().getTime(),
  });

  const task2 = new models.Task({
    text: "do laundry",
    isDone: true,
    dateCreated: new Date().getTime() + 1,
  });

  await task1.save();
  await task2.save();
  console.log("finished seeding database");
}
