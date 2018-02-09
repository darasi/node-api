import Boom from 'boom';
import paypal from '../config/paypal';

/**
 * Create new PaypalTransaction.
 *
 * @param  {Object} body
 * @return {Promise}
 */
export const createPaypalTransaction = (body) => {
  return new Promise((resolve,reject) => {
    paypal.payment.create(body, (error, payment) => {
      if (error) {
        reject(error);
        throw Boom.paymentRequired('An error occured during transaction', error);
      } else {
        resolve(payment);
      }
    });
  })
    .then(pay => pay);
};
/**
 * Get PaypalTransaction by id.
 *
 * @param  {Number|String} id
 * @return {Promise}
 */
export const getPaypalTransaction = (id) => {
  return new Promise((resolve,reject) => {
    paypal.payment.get(id, function (error, payment) {
      if (error) {
        reject(error);
        throw Boom.paymentRequired('An error occured during transaction', error);
      } else {
        resolve(payment);
      }
    });
  })
    .then(pay => pay);
};
/**
 * Execute new PaypalTransaction.
 *
 * @param  {Number|String} paymentId
 * @param  {Object} json
 * @return {Promise}
 */
export const executePaypalTransaction = (paymentId, json) => {
  return new Promise((resolve,reject) => {
    paypal.payment.execute(paymentId, json, (error, payment) => {
      if (error) {
        reject(error);
        throw Boom.paymentRequired('An error occured during transaction', error);
      } else {
        resolve(payment);
      }
    });
  })
    .then(pay => pay);
};
