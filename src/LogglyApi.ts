import fetch from 'cross-fetch';

// 組織底層
export class LogglyApi {
  token;
  tags;

  constructor(token, tags) {
    this.token = token;
    this.tags = tags;
  }

  /**
   *
   * @param jsonData
   * @returns {Promise.<TResult>}
   */
  async send(jsonData = {}) {
    return this._fetch(jsonData);
  }

  // ============================================================
  //  private
  // ============================================================

  /**
   *
   * @param jsonData
   * @returns {Promise.<TResult>}
   * @private
   */
  async _fetch(jsonData) {
    // console.log(this._buildUrl());
    // console.log(jsonData);

    //
    const promise = fetch(this._buildUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    })
      .then(async function(response) {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          const error = new Error(response.statusText);
          error.response = response;
          throw error;
        }
      })
      .then(function(jsonData) {
        return jsonData;
      });

    return promise;
  }

  _buildUrl() {
    const endpoint = '//logs-01.loggly.com/inputs/';
    return endpoint + this.token + '/tag/' + this.tags + '/';
  }
}
