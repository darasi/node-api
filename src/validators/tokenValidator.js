import Boom from 'boom';
import auth from '../config/auth';
import * as jwt from 'jsonwebtoken';
import * as tokenService from '../services/tokenService';

/**
 * Validate access token.
 *
 * @param  {object}   request
 * @param  {object}   response
 * @param  {function} next
 * @returns {Promise}
 */
export function validateAccessToken(request, response, next) {
  if ('authorization' in request.headers) {
    jwt.verify(request.headers.authorization.substring(7), auth.accessTokenSalt, (error, decodedToken) => {
      if (decodedToken) {
        request.userInfo = decodedToken;
        next();
      } else if (error.name === 'TokenExpiredError') {
        next(Boom.clientTimeout('Token Expired'));
      } else {
        next(Boom.unauthorized('Invalid Token'));
      }
    });
  } else {
    next(Boom.unauthorized('Unauthorized'));
  }
}

/**
 * Validate refresh token.
 *
 * @param  {object}   request
 * @param  {object}   response
 * @param  {function} next
 * @return {Promise}
 */
export function validateRefreshToken(request, response, next) {
  if ('authorization' in request.headers) {
    let refreshToken = request.headers.authorization.substring(7);
    jwt.verify(refreshToken, auth.refreshTokenSalt, (error, decodedToken) => {
      if (decodedToken) {
        request.userInfo = decodedToken;
        next();
      } else if (error.name === 'TokenExpiredError') {
        next(Boom.clientTimeout('Token expired'));
      } else {
        next(Boom.unauthorized('Invalid Token'));
      }
    });
  } else {
    next(Boom.unauthorized('Bad Request'));
  }
}

/**
 * Validate tokens existence.
 *
 * @param  {object}   request
 * @param  {object}   response
 * @param  {function} next
 * @return {Promise}
 */
export function findToken(request, response, next) {
  return tokenService
    .getToken(request.headers.authorization.substring(7))
    .then(() => next())
    // .catch(() => next(Boom.notAcceptable('Token not found')));
    .catch(() => next());
}
