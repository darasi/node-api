import HttpStatus from 'http-status-codes';

/**
 * Error response middleware for 404 not found.
 *
 * @param  {Object}   req
 * @param  {Object}   res
 * @param  {Function} next
 */
export default function notFoundError(req, res, next) {
  res.status(HttpStatus.NOT_FOUND).json({
    error: {
      code: HttpStatus.NOT_FOUND,
      message: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
    }
  });
}
