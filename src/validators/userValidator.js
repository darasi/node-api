import Joi from 'joi';
import Boom from 'boom';
import validate from '../utils/validate';
import * as userService from '../services/userService';

const SCHEMA = {
  name: Joi.string()
    .label('Name')
    .trim()
    .max(90)
    .required(),
  email: Joi.string()
    .label('Email')
    .trim()
    .max(90)
    .required(),
  password: Joi.string()
    .label('Password')
    .trim()
    .min(6)
    .max(90)
    .required()
};

const LOGIN_SCHEMA = {
  email: Joi.string()
    .label('Email')
    .trim()
    .max(90)
    .required(),
  password: Joi.string()
    .label('Password')
    .trim()
    .max(90)
    .required()
};

/**
 * Validate create/update user request.
 *
 * @param  {object}   request
 * @param  {object}   response
 * @param  {function} next
 * @return {Promise}
 */
export function userValidator(request, response, next) {
  return validate(request.body, SCHEMA)
    .then(() => next())
    .catch(err => next(err));
}

/**
 * Email unique validation
 *
 * @param request
 * @param response
 * @param next
 * @returns {Promise}
 */
export function userEmailValidator(request, response, next) {
  return userService.getUserByEmail(request.body.email)
    .then((user) => next(Boom.badData('Email already exist')))
    .catch(error => error.isBoom && error.output.statusCode === 404 ? next() : next(error));
}

/**
 * Validate user login request.
 *
 * @param  {object}   request
 * @param  {object}   response
 * @param  {function} next
 * @return {Promise}
 */
export function loginValidator(request, response, next) {
  return validate(request.body, LOGIN_SCHEMA)
    .then(() => next())
    .catch(err => next(err));
}

/**
 * Validate users existence.
 *
 * @param  {object}   request
 * @param  {object}   response
 * @param  {function} next
 * @return {Promise}
 */
export function findUser(request, response, next) {
  return userService
    .getUser(request.params.id)
    .then(() => next())
    .catch(err => next(err));
}

/**
 * Check for not authenticate
 *
 * @param  {object}   request
 * @param  {object}   response
 * @param  {function} next
 * @return {Promise}
 */
export async function isNotAuthenticated(req, res, next) {
  try {
    let token = await userService.hasToken(req.body.email);
    if(token.length) {
      return next(Boom.badData('Already authenticated'));
    } else {
      return next();
    }

  } catch(err) {
    return next(err);
  }
  // return userService
  //   .hasToken(request.body.email)
  //   .then((result) => {
  //     result.length ? next(Boom.badData('Already authenticated')) : next();
  //   })
  //   .catch(err => next(err));
}
