import paypal from 'paypal-rest-sdk';
import env from './env';

paypal.configure({
  'mode': env('APP_ENV') === 'production' ? 'live' : 'sandbox', // sandbox or live
  'client_id': env('PAYPAL_CLIENT_ID'),
  'client_secret': env('PAYPAL_CLIENT_SECRET')
});

export default paypal;
