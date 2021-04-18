import http from 'http';
import { connectDb } from 'src/server/models';
import app from './app';
import models from 'src/server/models';

const eraseDatabaseOnSync: boolean = true;
const port = process.env.PORT;
app.set('port', port);
var server = http.createServer(app);

connectDb().then( async () => {
  if (eraseDatabaseOnSync) {
    await Promise.all([
      models.User.deleteMany({}),
      models.Task.deleteMany({}),
    ]);

    seedDatabase();
  }

  server.listen(port);
  server.on('error', (error) => {
    throw error;
  });
  server.on('listening', () => {
    console.log("App is listening on port " + port);
  });
});

async function seedDatabase() {
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
