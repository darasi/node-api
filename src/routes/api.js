import { Router } from 'express';
import config from '../config/app';
import * as HTTPStatus from 'http-status-codes';
import * as SearchService from '../services/searchService';
import tagsController from '../controllers/tagsController';
import authController from '../controllers/authController';
import usersController from '../controllers/usersController';
import postsController from '../controllers/postsController';
import { validateAccessToken } from '../validators/tokenValidator';

let router = Router();

// router.get('/', validateAccessToken, (req, res, next) => {
//   if (!req.query.search) {
//     next();
//   } else {
//     SearchService.search(req.query.search, req.query.page)
//       .then(data => res.status(HTTPStatus.OK).json(data))
//       .catch(error => next(error));
//   }
// });

router.use('/', authController);

router.use('/tags', /* validateAccessToken,*/ tagsController);
router.use('/users', /* validateAccessToken,*/ usersController);
router.use('/posts', validateAccessToken, postsController);

export default router;
