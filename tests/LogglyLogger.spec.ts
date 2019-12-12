import { LogglyClient } from '../src';

describe('LogglyLogger', () => {
  const token = 'test';
  let logger;

  beforeEach(() => {
    logger = new LogglyClient(token);
  });

  // describe('debug()', () => {
  // });

  it('LogglyLogger normal flow', () => {
    const tags = 'test-only';
    logger = new LogglyClient(token, tags);
    logger.setChannel('local');

    const message = 'test';
    const promise = logger.info(message, {
      redirect_result: true,
      redirect_url: 'https://127.0.0.1',
    });

    promise
      .then(function(data) {
        // todo
      })
      .catch(function(error) {
        // console.error(`[universal-loggly]: to log error`);
      })
      .finally(function() {
        // window.location.href = redirectUrl;
      });
  });
});
