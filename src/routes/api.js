import { Router } from 'express';
import config from '../config/app';
import * as HTTPStatus from 'http-status-codes';
import * as SearchService from '../services/searchService';
import { validateAccessToken } from '../validators/tokenValidator';
import authController from '../controllers/authController';
import usersController from '../controllers/usersController';
import postsController from '../controllers/postsController';
import checkoutController from '../controllers/checkoutController';
import tagsController from '../controllers/tagsController';

const router = Router();

router.use('/auth', authController);
router.use('/users', /* validateAccessToken,*/ usersController);
router.use('/posts', validateAccessToken, postsController);
router.use('/checkout', checkoutController);
router.use('/tags', /* validateAccessToken,*/ tagsController);

// router.get('/search', validateAccessToken, (req, res, next) => {
//   if (!req.query.search) {
//     next();
//   } else {
//     SearchService.search(req.query.search, req.query.page)
//       .then(data => res.status(HTTPStatus.OK).json(data))
//       .catch(error => next(error));
//   }
// });

export default router;
