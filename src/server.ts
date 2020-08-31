import express from 'express';
import path from 'path';

const app: express.Application = express();

app.use(express.static(__dirname));

app.get('/', function (req: express.Request, res: express.Response) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3000, function () {
  console.log("App is listening on port 3000!");
});
