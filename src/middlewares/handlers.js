import HttpStatus from 'http-status-codes';

import logger from '../utils/logger';

/**
 * Generic error response middleware for validation and internal server errors.
 *
 * @param  {Object}   err
 * @param  {Object}   req
 * @param  {Object}   res
 * @param  {Function} next
 */
export const errorHandler = (err, req, res, next) => {
  let error = convertExceptionToJSONResponse(err);
  res.status(error.code).json({ error });
};

/**
 * Build error response for validation errors.
 *
 * @param  {Error} error
 * @return {Object}
 */
export const convertExceptionToJSONResponse = (error) => {
  if(!error.isJoi && !error.isBoom) { logger.error(error);}

  // Validation errors
  if (error.isJoi) {
    return {
      code: HttpStatus.UNPROCESSABLE_ENTITY,
      message: HttpStatus.getStatusText(HttpStatus.UNPROCESSABLE_ENTITY),
      details: error.details && error.details.map(error => {
        return {
          message: error.message,
          param: error.path.join('.')
        };
      })
    };
  }

  // HTTP errors
  if (error.isBoom) {
    return {
      code: error.output.statusCode,
      message: error.output.payload.message || error.output.payload.error,
      details: error.output.payload.attributes && [error.output.payload.attributes] || []
    };
  }

  // Return INTERNAL_SERVER_ERROR for all other cases
  return {
    code: HttpStatus.INTERNAL_SERVER_ERROR,
    message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
  };
};

export const nodeErrorHandler = (err) => {
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
      logger.error(err);
      throw err;
  }
};
