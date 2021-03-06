import Boom from 'boom';
import * as bcrypt from 'bcryptjs';
import passport from 'passport';
import passportFacebookToken from 'passport-facebook-token';

import User from '../models/User';
import auth, { facebook_token } from '../config/auth';
import { createSession } from './tokenService';
import config from '../config/app';
import logger from '../utils/logger';

/**
 * Get all users.
 *
 * @return {Promise}
 */
export function getAllUsers(page = 1) {
  return User.fetchPage({
    page: page,
    pageSize: config.APP_PAGE_LIMIT
  }).then(results => results);
}

/**
 * Get a user.
 *
 * @param  {Number|String}  id
 * @return {Promise}
 */
export async function getUser(id) {
  try {
    const user = await new User({ id }).fetch({ withRelated: ['posts'] });
    if (!user) {
      throw Boom.notFound('User not found');
    }

    return user;
  } catch(err) {
    throw Boom.notFound('User not found');
  }
}

/**
 * Get a user.
 *
 * @param  {Number|String}  email
 * @return {Promise}
 */
export function getUserByEmail(email) {
  return new User({ email }).fetch().then(user => {
    if (!user) {
      throw Boom.notFound('User not found');
    }

    return user;
  });
}

export function hasToken(email) {
  return new User({ email: email }).fetch({ withRelated: ['token'] })
    .then(user => {
      return Object.entries(user ? user.toJSON().token : {});
    })
    .catch(error => console.log(error));
}

/**
 * Create new user.
 *
 * @param  {Object}  user
 * @return {Promise}
 */
export function register(user) {
  return new User({
    name: user.name,
    email: user.email,
    password: bcrypt.hashSync(user.password, parseInt(auth.saltRounds))
  }).save()
    .then((user) => {
      return createSession(user);
    })
    .catch(error => {
      return error;
    });
}

/**
 * Login user.
 *
 * @param  {Object}  currentUser
 * @return {Promise}
 */
export function login(currentUser) {
  return getUserByEmail(currentUser.email).then(user => {
    if (bcrypt.compareSync(currentUser.password, user.get('password'))) {
      return createSession(user);
    } else {
      throw Boom.unauthorized('invalid password');
    }
  });
}

/**
 * Update a user.
 *
 * @param  {Number|String}  id
 * @param  {Object}         user
 * @return {Promise}
 */
export function updateUser(id, user) {
  return new User({ id })
    .save({ name: user.name })
    .then(user => user.refresh());
}

/**
 * Delete a user.
 *
 * @param  {Number|String}  id
 * @return {Promise}
 */
export function deleteUser(id) {
  return new User({ id }).fetch().then(user => {
    if (!user) {
      throw Boom.notFound('User not found');
    }

    return user.destroy();
  });
}

/**
 * passport-facebook-token middleware
 * @param {object} request
 * @param {object} response
 * @param {function} next
 */
export const fbTokenAuth = (request, response, next) => {
  passport.use(new passportFacebookToken(facebook_token, function (accessToken, refreshToken, profile, done) {
    new User({ provider: profile.provider, fb_id: profile.id }).fetch().then(user => {
      try {
        if (!user) {
          new User({
            name: profile.displayName,
            first_name: profile._json.first_name,
            last_name: profile._json.last_name,
            email: profile.emails[0].value ? profile.emails[0].value : null,
            password: bcrypt.hashSync(Math.random().toString(36).slice(2), parseInt(auth.saltRounds)),
            provider: profile.provider,
            fb_id: profile.id,
            photo_url: profile.photos[0].value ? profile.photos[0].value : null
          })
            .save()
            .then(user => done(null, user))
            .catch(error => done(error, false));
        } else {
          return done(null, user);
        }
      } catch (error) {
        logger.error(error);
      }
    });
  }));

  return passport.authenticate('facebook-token', { session: false });
};
