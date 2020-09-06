import express from 'express';
import path from 'path';
import "regenerator-runtime/runtime.js";  // enable async functions
import routes from 'src/server/routes';

const app: express.Application = express();
const client_dir = path.normalize(__dirname + './../client');

app.use(express.static(client_dir));  // serve static files
app.use(express.json());  // parse JSON bodies for this app

app.use('/tasks', routes.task);

app.get('/', function (req: express.Request, res: express.Response) {
  res.sendFile(path.join(client_dir + '/index.html'));
});

export default app;