import { LogglyApi } from './LogglyApi';
import { EnvInspect } from './lib/env-inspect';

// 組織送出結構
export class LogglyLoggerFormatter {
  logglyApi;

  constructor(token, tags) {
    this.logglyApi = new LogglyApi(token, tags);
  }

  /**
   * @param levelName
   * @param message
   * @param context
   * @returns {Promise.<TResult>}
   */
  send(levelName, message, context) {
    const date = new Date();
    const json = {
      message,
      context,
      level: this._convertLevelName(levelName),
      level_name: levelName,
      url_info: {},
      timestamp: Math.floor(date.getTime() / 1000),
      datetime: {
        date: date.toISOString(), // iso8601
        /*
        // timezone_offset: date.getTimezoneOffset(),
        // "date": "2019-06-11 06:48:04.019295",
        // "timezone": "UTC"
        */
      },
    };

    if (EnvInspect.isWeb()) {
      json.url_info = {
        host: window.location.hostname,
        path: window.location.pathname,
        query: window.location.search,
        url: window.location.href,
      };
      if (document.referrer) {
        json.url_info.referrer = document.referrer;
      }
    }

    return this.logglyApi.send(json);
  }

  // ============================================================
  //  private
  // ============================================================

  /**
   * convert Laravel level number
   *
   * @param levelName
   * @returns {number}
   * @private
   */
  _convertLevelName(levelName) {
    switch (levelName) {
      case 'DEBUG':
        return 100;
      case 'INFO':
        return 200;
      case 'NOTICE':
        return 250;
      case 'WARNING':
        return 300;
      case 'ERROR':
        return 400;
      case 'CRITICAL':
        return 500;
      case 'ALERT':
        return 550;
      case 'EMERGENCY':
        return 600;
    }
  }
}
