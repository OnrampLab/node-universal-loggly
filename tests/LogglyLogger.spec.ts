import { LogglyClient } from '../src'
import nock from 'nock'

const base = 'https://logs-01.loggly.com'
function createNockMock(fn: typeof jest['fn'], token: string, tags?: string) {
  nock(`${base}`)
    .post(`/inputs/${token}/tag/${tags}/`)
    .reply((uri, reqBody) => {
      fn()
      console.log(reqBody)
      return [201, {message: 'success'}]
    })
}

describe('LogglyLogger', () => {
  const token = 'test'

  it('LogglyLogger normal flow', async () => {
    const tags = 'test-only'
    let logger = new LogglyClient(base, token, tags)

    const message = 'test'

    const fn = jest.fn()

    createNockMock(fn, token, tags)

    await logger.info(message, {
      redirect_result: true,
      redirect_url: 'https://127.0.0.1',
    })

    expect(fn).toBeCalled()
  })
})
