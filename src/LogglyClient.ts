import { LogglyLoggerFormat } from './LogglyLoggerFormat';

/**
 *  feature
 *    - public
 *    - 模擬 laravel log 的行為
 *    - 傳遞的資料也類似 laravel log
 *
 *  可能無法發送訊息的原因
 *    - token 有問題
 *    - 被 browser 的廣告 plugin 阻止
 */
export class LogglyClient {
  logglyLoggerFormat;

  constructor(token, tags) {
    this.logglyLoggerFormat = new LogglyLoggerFormat(token, tags);
  }

  // ============================================================
  //  send log
  // ============================================================

  debug(message, context = {}) {
    return this._log('DEBUG', message, context);
  }

  info(message, context = {}) {
    return this._log('INFO', message, context);
  }

  warn(message, context = {}) {
    return this._log('WARNING', message, context);
  }

  error(message, context = {}) {
    return this._log('ERROR', message, context);
  }

  // ============================================================
  //  private
  // ============================================================

  // 如果有 cache 到訊息, 利用 console.log() 列出來
  // 因為這裡是邏輯層，在這裡顯示是合理的

  /**
   *
   * @param levelName
   * @param message
   * @param context
   * @private
   * @returns {Promise.<TResult>}
   */
  _log(levelName, message, context) {
    return this.logglyLoggerFormat.send(levelName, message, context);
  }
}
