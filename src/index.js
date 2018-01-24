import cors from 'cors';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import api from './routes/api';
import config from './config/app';
import bodyParser from 'body-parser';
import { errorHandler } from './middlewares/handlers';

const app = express();

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

app.listen(config.APP_PORT, config.APP_HOST, () => {
  console.log(`Server started at http://${config.APP_HOST}:${config.APP_PORT}`);
});
