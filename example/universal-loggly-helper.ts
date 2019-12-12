import getConfig from "next/config";
import { LogglyClient } from "universal-loggly";

const tags = "localhost, staging, test-only";

function getToken() {
  return process.env.LOGGLYPLUS_TOKEN;
}

function getToken_2() {
  const { publicRuntimeConfig } = getConfig() || {};
  const { LOGGLYPLUS_TOKEN } = publicRuntimeConfig || {};
  return LOGGLYPLUS_TOKEN;
}

// factoryLogger()
export function factoryLogglyClient() {
  const token = getToken();

  const logger = new LogglyClient(token, tags);
  return logger;
}

/*
const logger = factoryLogglyClient();

const message = 'test message';
const promise = logger.info(message, {
  redirect_result: true,
  redirect_url: 'https://127.0.0.1',
});

promise
  .then(function(data) {
    console.log('log ok');
  })
  .catch(function(error) {
    console.error(`[universal-loggly]: ${error}`);
  })
  .finally(function() {
    console.log('log final');
  });
*/
