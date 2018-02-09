import { Router } from 'express';
import config from '../config/app';
import * as HTTPStatus from 'http-status-codes';
import * as SearchService from '../services/searchService';
import { validateAccessToken } from '../validators/tokenValidator';
import {
  authController,
  usersController,
  postsController,
  checkoutController,
  tagsController
} from '../controllers';

const router = Router();

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
router.use('/users', /* validateAccessToken,*/ usersController);
router.use('/posts', validateAccessToken, postsController);
router.use('/checkout', checkoutController);
router.use('/tags', /* validateAccessToken,*/ tagsController);

export default router;
