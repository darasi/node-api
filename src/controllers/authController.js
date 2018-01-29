import { Router } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as userService from '../services/userService';
import * as tokenService from '../services/tokenService';
import { findToken, validateRefreshToken } from '../validators/tokenValidator';
import {
  isNotAuthenticated,
  loginValidator,
  userValidator,
  userEmailValidator
} from '../validators/userValidator';

const router = Router();

router.post('/email', userEmailValidator, (request, response) => {
  return new Promise(() => response.status(HttpStatus.OK).json({ info: 'The given email is valid' }));
});

router.post('/register', userValidator, userEmailValidator, async (request, response, next) => {
  userService
    .register(request.body)
    .then(data => response.status(HttpStatus.CREATED).json({ data }))
    .catch(error => next(error));
});

router.post('/login', loginValidator, isNotAuthenticated, (request, response, next) => {
  userService
    .login(request.body)
    .then(data => response.status(HttpStatus.CREATED).json({ data }))
    .catch(error => next(error));
});

router.post('/token', findToken, validateRefreshToken, (request, response, next) => {
  tokenService
    .createAccessToken(request)
    .then(data => response.status(HttpStatus.OK).json(data))
    .catch(error => next(error));
});

router.post('/current_user', findToken, validateRefreshToken, (request, response, next) => {
  userService
    .getUser(request.userInfo.data.id)
    .then(data => response.status(HttpStatus.OK).json(data))
    .catch(error => next(error));
});

router.post('/logout', findToken, validateRefreshToken, (request, response, next) => {
  tokenService
    .deleteToken(request.headers.authorization.substring(7))
    .then(data => response.status(HttpStatus.OK).json(data))
    .catch(error => next(error));
});

export default router;
