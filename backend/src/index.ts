import { config } from './config';
import * as express from 'express';
import { expressApp } from './expressApp';
import { databaseSource } from './dbSource';

const StartServer = async () => {
  databaseSource
    .initialize()
    .then(() => {
      console.log('Database connection established succesfully!');
    })
    .catch((err: Error) => {
      console.error(err);
      process.exit();
    });

  const app = express();

  await expressApp(app);

  app
    .listen(config.BACKEND_PORT, () => {
      console.log(
        `backend app successfully started on port ${config.BACKEND_PORT}!`,
      );
    })
    .on('error', (err) => {
      console.error(err);
      process.exit();
    });
};

StartServer();
