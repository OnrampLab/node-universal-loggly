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

export function factoryLogglyClient() {
  const token = getToken();

  const logger = new LogglyClient('https://logs-01.loggly.com', token, tags);
  return logger;
}
