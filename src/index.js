import fs from 'fs';
import path from'path';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import bodyParser from 'body-parser';

import api from './routes/api';
import config from './config/app';
import logger from './utils/logger';
import { errorHandler, nodeErrorHandler } from './middlewares/handlers';

const app = express();

if (!fs.existsSync('./logs')) {fs.mkdirSync('./logs');}
if (!fs.existsSync('./static')) {fs.mkdirSync('./static');}

app.use(compression());
app.use(cors({
  origin: ['https://melnf.com','http://localhost:3005','http://localhost:8000','http://localhost:8080'],
  optionsSuccessStatus: 200
}));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', api);
app.use('/static', express.static(path.join(__dirname, '../static')));
app.use(errorHandler);

app
  .listen(config.APP_PORT, config.APP_HOST, () => {
    logger.info(`Server started at http://${config.APP_HOST}:${config.APP_PORT}`);
  })
  .on('error', nodeErrorHandler);
