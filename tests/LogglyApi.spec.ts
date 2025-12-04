import { LogglyApi } from '../src/LogglyApi'
import nock from 'nock'

describe('LogglyApi', () => {
  const host = 'https://logs-01.loggly.com'
  const token = 'test-token'
  const tags = 'test-tags'

  afterEach(() => {
    nock.cleanAll()
  })

  describe('constructor', () => {
    it('should set host, token, and tags', () => {
      const api = new LogglyApi(host, token, tags)

      expect(api.host).toBe(host)
      expect(api.token).toBe(token)
      expect(api.tags).toBe(tags)
    })

    it('should allow undefined tags', () => {
      const api = new LogglyApi(host, token)

      expect(api.tags).toBeUndefined()
    })
  })

  describe('baseUrl', () => {
    it('should return correct URL format', () => {
      const api = new LogglyApi(host, token, tags)

      expect(api.baseUrl).toBe(`${host}/inputs/${token}/tag/${tags}/`)
    })

    it('should update when token changes', () => {
      const api = new LogglyApi(host, token, tags)
      api.token = 'new-token'

      expect(api.baseUrl).toBe(`${host}/inputs/new-token/tag/${tags}/`)
    })
  })

  describe('send', () => {
    it('should send POST request with JSON body', async () => {
      const api = new LogglyApi(host, token, tags)
      const payload = { message: 'test', level: 200 }

      let receivedBody: unknown
      nock(host)
        .post(`/inputs/${token}/tag/${tags}/`)
        .reply(200, function(_uri, requestBody) {
          receivedBody = requestBody
          return { response: 'ok' }
        })

      await api.send(payload)

      expect(receivedBody).toEqual(payload)
    })

    it('should return parsed JSON response on success', async () => {
      const api = new LogglyApi(host, token, tags)
      const expectedResponse = { response: 'ok', id: '12345' }

      nock(host)
        .post(`/inputs/${token}/tag/${tags}/`)
        .reply(200, expectedResponse)

      const result = await api.send({ message: 'test' })

      expect(result).toEqual(expectedResponse)
    })

    it('should handle 201 status as success', async () => {
      const api = new LogglyApi(host, token, tags)

      nock(host)
        .post(`/inputs/${token}/tag/${tags}/`)
        .reply(201, { created: true })

      const result = await api.send({ message: 'test' })

      expect(result).toEqual({ created: true })
    })

    it('should reject on 4xx error', async () => {
      const api = new LogglyApi(host, token, tags)

      nock(host)
        .post(`/inputs/${token}/tag/${tags}/`)
        .reply(400, { error: 'bad request' })

      await expect(api.send({ message: 'test' })).rejects.toBeDefined()
    })

    it('should reject on 5xx error', async () => {
      const api = new LogglyApi(host, token, tags)

      nock(host)
        .post(`/inputs/${token}/tag/${tags}/`)
        .reply(500, { error: 'server error' })

      await expect(api.send({ message: 'test' })).rejects.toBeDefined()
    })

    it('should send empty object by default', async () => {
      const api = new LogglyApi(host, token, tags)

      let receivedBody: unknown
      nock(host)
        .post(`/inputs/${token}/tag/${tags}/`)
        .reply(200, function(_uri, requestBody) {
          receivedBody = requestBody
          return { response: 'ok' }
        })

      await api.send()

      expect(receivedBody).toEqual({})
    })

    it('should set Content-Type header to application/json', async () => {
      const api = new LogglyApi(host, token, tags)

      let contentType: string | string[] | undefined
      nock(host)
        .post(`/inputs/${token}/tag/${tags}/`)
        .reply(200, function() {
          contentType = this.req.headers['content-type']
          return { response: 'ok' }
        })

      await api.send({ message: 'test' })

      expect(contentType).toContain('application/json')
    })
  })
})
