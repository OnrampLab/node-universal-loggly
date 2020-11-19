import fetch from 'cross-fetch'

/**
 * @desc 組織底層
 */
export class LogglyApi {
  constructor(public host: string, public token: string, public tags?: string) {
    this.send.bind(this)
  }

  get baseUrl() {
    return `${this.host}/inputs/${this.token}/tag/${this.tags}/`
  }

  async send<T>(jsonData = {} as T) {
    return fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    })
      .then(function (response) {
        if (response.status >= 200 && response.status < 300) {
          return response.json()
        } else {
          return Promise.reject(response)
        }
      })
      .then(function (jsonData) {
        return jsonData
      })
  }
}
