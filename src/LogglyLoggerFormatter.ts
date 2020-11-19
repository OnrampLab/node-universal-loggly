import { EnvInspect } from './lib/env-inspect'
import { LevelName } from './LogglyLevel'

// 組織送出結構
export class LogglyLoggerFormatter {

  format<T>(levelName: LevelName, message: string, context = {} as T) {
    const date = new Date()
    const json = {
      message,
      context,
      level: this._convertLevelName(levelName),
      level_name: levelName,
      url_info: {} as Record<string, string>,
      timestamp: Math.floor(date.getTime() / 1000),
      datetime: {
        date: date.toISOString(), // iso8601
        /*
        // timezone_offset: date.getTimezoneOffset(),
        // "date": "2019-06-11 06:48:04.019295",
        // "timezone": "UTC"
        */
      },
    }

    if (EnvInspect.isWeb()) {
      json.url_info = {
        host: window.location.hostname,
        path: window.location.pathname,
        query: window.location.search,
        url: window.location.href,
      }
      if (document.referrer) {
        json.url_info.referrer = document.referrer
      }
    }

    return json
  }

  // ============================================================
  //  private
  // ============================================================

  /**
   * convert Laravel level number
   */
  private _convertLevelName(levelName: LevelName) {
    switch (levelName) {
      case 'DEBUG':
        return 100
      case 'INFO':
        return 200
      case 'NOTICE':
        return 250
      case 'WARNING':
        return 300
      case 'ERROR':
        return 400
      case 'CRITICAL':
        return 500
      case 'ALERT':
        return 550
      case 'EMERGENCY':
        return 600
    }
  }
}
