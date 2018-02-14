import logger from '../utils/logger';

export default function nodeErrorHandler(err) {
  switch (err.code) {
    case 'EACCES':
      logger.error('Port requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error('Port is already in use.');
      process.exit(1);
      break;
    default:
      throw err;
  }
}
