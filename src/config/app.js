import env from './env';

export default {
  APP_NAME: env('APP_NAME'),
  APP_ENV: env('APP_ENV'),
  APP_VERSION: env('APP_VERSION'),
  APP_HOST: env('APP_HOST', '127.0.0.1'),
  APP_PORT: env('APP_ENV') === 'test' ? env('TEST_APP_PORT') : env('APP_PORT', '8000'),
  APP_TIMEZONE: '+04:00',
  APP_PAGE_LIMIT: env('APP_PAGE_LIMIT', 10),
  LOGGING_DIR: __dirname + '/../../' + env('LOGGING_DIR', 'logs'),
  LOGGING_LEVEL: env('LOGGING_LEVEL', 'debug')
};
