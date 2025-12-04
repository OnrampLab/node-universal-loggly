import { LogglyClient } from '../src'
import nock from 'nock'

describe('LogglyClient', () => {
  const host = 'https://logs-01.loggly.com'
  const token = 'test-token'
  const tags = 'test-tags'

  afterEach(() => {
    nock.cleanAll()
  })

  describe('constructor', () => {
    it('should initialize with host, token, and tags', () => {
      const client = new LogglyClient(host, token, tags)

      expect(client.logglyApi.host).toBe(host)
      expect(client.logglyApi.token).toBe(token)
      expect(client.logglyApi.tags).toBe(tags)
    })

    it('should initialize formatter', () => {
      const client = new LogglyClient(host, token, tags)

      expect(client.formatter).toBeDefined()
    })
  })

  describe('setChannel', () => {
    it('should update token', () => {
      const client = new LogglyClient(host, token, tags)

      client.setChannel('new-channel')

      expect(client.logglyApi.token).toBe('new-channel')
    })
  })

  describe('log methods', () => {
    const logMethods = [
      { method: 'debug', levelName: 'DEBUG', level: 100 },
      { method: 'info', levelName: 'INFO', level: 200 },
      { method: 'notice', levelName: 'NOTICE', level: 250 },
      { method: 'warn', levelName: 'WARNING', level: 300 },
      { method: 'error', levelName: 'ERROR', level: 400 },
      { method: 'critical', levelName: 'CRITICAL', level: 500 },
      { method: 'alert', levelName: 'ALERT', level: 550 },
      { method: 'emergency', levelName: 'EMERGENCY', level: 600 },
    ] as const

    it.each(logMethods)(
      '$method() should send log with level $levelName ($level)',
      async ({ method, levelName, level }) => {
        const client = new LogglyClient(host, token, tags)
        const message = 'test message'
        const context = { key: 'value' }

        let receivedBody: Record<string, unknown> = {}
        nock(host)
          .post(`/inputs/${token}/tag/${tags}/`)
          .reply(200, function(_uri, requestBody) {
            receivedBody = requestBody as Record<string, unknown>
            return { response: 'ok' }
          })

        await client[method](message, context)

        expect(receivedBody.message).toBe(message)
        expect(receivedBody.context).toEqual(context)
        expect(receivedBody.level_name).toBe(levelName)
        expect(receivedBody.level).toBe(level)
      }
    )

    it('should include timestamp and datetime in log', async () => {
      const client = new LogglyClient(host, token, tags)

      let receivedBody: Record<string, unknown> = {}
      nock(host)
        .post(`/inputs/${token}/tag/${tags}/`)
        .reply(200, function(_uri, requestBody) {
          receivedBody = requestBody as Record<string, unknown>
          return { response: 'ok' }
        })

      await client.info('test', {})

      expect(receivedBody.timestamp).toBeDefined()
      expect(typeof receivedBody.timestamp).toBe('number')
      expect(receivedBody.datetime).toBeDefined()
    })
  })

  describe('error handling', () => {
    it('should propagate API errors', async () => {
      const client = new LogglyClient(host, token, tags)

      nock(host)
        .post(`/inputs/${token}/tag/${tags}/`)
        .reply(500, { error: 'server error' })

      await expect(client.info('test', {})).rejects.toBeDefined()
    })

    it('should handle network errors', async () => {
      const client = new LogglyClient(host, token, tags)

      nock(host)
        .post(`/inputs/${token}/tag/${tags}/`)
        .replyWithError('Network error')

      await expect(client.info('test', {})).rejects.toBeDefined()
    })
  })

  describe('integration', () => {
    it('should send multiple logs sequentially', async () => {
      const client = new LogglyClient(host, token, tags)
      const callOrder: string[] = []

      nock(host)
        .post(`/inputs/${token}/tag/${tags}/`)
        .reply(200, function(_uri, requestBody) {
          const body = requestBody as Record<string, unknown>
          callOrder.push(body.level_name as string)
          return { response: 'ok' }
        })
        .post(`/inputs/${token}/tag/${tags}/`)
        .reply(200, function(_uri, requestBody) {
          const body = requestBody as Record<string, unknown>
          callOrder.push(body.level_name as string)
          return { response: 'ok' }
        })

      await client.info('first', {})
      await client.error('second', {})

      expect(callOrder).toEqual(['INFO', 'ERROR'])
    })

    it('should work with different channels', async () => {
      const client = new LogglyClient(host, token, tags)
      const newChannel = 'another-channel'

      nock(host)
        .post(`/inputs/${token}/tag/${tags}/`)
        .reply(200, { response: 'ok' })

      await client.info('first log', {})

      client.setChannel(newChannel)

      nock(host)
        .post(`/inputs/${newChannel}/tag/${tags}/`)
        .reply(200, { response: 'ok' })

      await client.info('second log', {})
    })
  })
})
