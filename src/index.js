import cors from 'cors';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import api from './routes/api';
import config from './config/app';
import bodyParser from 'body-parser';
import { errorHandler } from './middlewares/handlers';
import fs from 'fs';
import morgan from 'morgan';
import path from'path';

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, '../logs/errors.log'), { flags: 'a' });

app.use(morgan('combined', {
  stream: accessLogStream,
  skip: (req, res) => res.statusCode < 499
}));
app.use(compression());
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3005','http://localhost:8000'],
  optionsSuccessStatus: 200
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', api);
app.use(errorHandler);
app.use('/static', express.static(path.join(__dirname, '../static')));

app.listen(config.APP_PORT, config.APP_HOST, () => {
  console.log(`Server started at http://${config.APP_HOST}:${config.APP_PORT}`);
});
