import { LogglyApi } from './LogglyApi'
import { LevelName } from './LogglyLevel'
import { LogglyLoggerFormatter } from './LogglyLoggerFormatter'

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
  formatter: LogglyLoggerFormatter
  logglyApi: LogglyApi

  constructor(host: string, token: string, tags?: string) {
    this.formatter = new LogglyLoggerFormatter()
    this.logglyApi = new LogglyApi(host, token, tags)
  }

  setChannel(channel: string) {
    this.logglyApi.token = channel
  }

  // ============================================================
  //  send log
  // ============================================================

  debug = this._createLog('DEBUG')

  info = this._createLog('INFO')

  warn = this._createLog('WARNING')

  error = this._createLog('ERROR')

  critical = this._createLog('CRITICAL')

  alert = this._createLog('ALERT')

  emergency = this._createLog('EMERGENCY')

  notice = this._createLog('NOTICE')

  // ============================================================
  //  private
  // ============================================================

  // 如果有 cache 到訊息, 利用 console.log() 列出來
  // 因為這裡是邏輯層，在這裡顯示是合理的

  private _createLog<T>(levelName: LevelName) {
    return (message: string, context: T) =>
      this.logglyApi.send(this.formatter.format(levelName, message, context))
  }
}
