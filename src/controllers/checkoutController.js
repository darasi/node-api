import { Router } from 'express';
import * as HttpStatus from 'http-status-codes';
import { validateAccessToken, validateRefreshToken } from '../validators/tokenValidator';
import * as paypalService from '../services/paypalService';
const router = Router();

/**
 * POST /api/checkout/paypal
 */
router.post('/paypal', validateRefreshToken, (request, response, next) => {
  paypalService
    .createPaypalTransaction(request.body)
    .then(data => {
      for(let i = 0; i < data.links.length; i++) {
        if(data.links[i].rel === 'approval_url') {
          const approval_url = data.links[i].href;
          response.status(HttpStatus.OK).json({ approval_url });
        }
      }
    })
    .catch(error => next(error));
});

/**
 * GET /api/checkout/paypal/return
 */
router.get('/paypal/return', async(request, response, next) => {
  try {
    const payment = await paypalService.getPaypalTransaction(request.query.paymentId);
    const json = {
      'payer_id': payment.payer.payer_info.payer_id,
      'transactions': payment.transactions
    };
    const data = await paypalService.executePaypalTransaction(request.query.paymentId,json);
    if(data.state === 'approved') {
      response.redirect(request.query.successUrl);
    } else {
      response.redirect(request.query.cancelUrl);
    }
  } catch (err) {
    next(error);
    response.redirect(request.query.cancelUrl);
  }
});

export default router;
