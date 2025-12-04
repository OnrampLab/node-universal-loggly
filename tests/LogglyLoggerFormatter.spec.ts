import { LogglyLoggerFormatter } from '../src/LogglyLoggerFormatter'
import { LevelName } from '../src/LogglyLevel'

describe('LogglyLoggerFormatter', () => {
  let formatter: LogglyLoggerFormatter

  beforeEach(() => {
    formatter = new LogglyLoggerFormatter()
  })

  describe('format', () => {
    it('should include message in output', () => {
      const result = formatter.format('INFO', 'test message', {})

      expect(result.message).toBe('test message')
    })

    it('should include context in output', () => {
      const context = { userId: 123, action: 'login' }
      const result = formatter.format('INFO', 'test', context)

      expect(result.context).toEqual(context)
    })

    it('should use empty object as default context', () => {
      const result = formatter.format('INFO', 'test')

      expect(result.context).toEqual({})
    })

    it('should include level_name in output', () => {
      const result = formatter.format('ERROR', 'test', {})

      expect(result.level_name).toBe('ERROR')
    })

    it('should include timestamp as unix timestamp', () => {
      const before = Math.floor(Date.now() / 1000)
      const result = formatter.format('INFO', 'test', {})
      const after = Math.floor(Date.now() / 1000)

      expect(result.timestamp).toBeGreaterThanOrEqual(before)
      expect(result.timestamp).toBeLessThanOrEqual(after)
    })

    it('should include datetime with ISO date format', () => {
      const result = formatter.format('INFO', 'test', {})

      expect(result.datetime).toBeDefined()
      expect(result.datetime.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })

    it('should include empty url_info in non-browser environment', () => {
      const result = formatter.format('INFO', 'test', {})

      expect(result.url_info).toEqual({})
    })
  })

  describe('level conversion', () => {
    const levelMappings: Array<[LevelName, number]> = [
      ['DEBUG', 100],
      ['INFO', 200],
      ['NOTICE', 250],
      ['WARNING', 300],
      ['ERROR', 400],
      ['CRITICAL', 500],
      ['ALERT', 550],
      ['EMERGENCY', 600],
    ]

    it.each(levelMappings)(
      'should convert %s to level %d',
      (levelName, expectedLevel) => {
        const result = formatter.format(levelName, 'test', {})

        expect(result.level).toBe(expectedLevel)
      }
    )
  })

  describe('complex context', () => {
    it('should handle nested objects in context', () => {
      const context = {
        user: {
          id: 1,
          profile: {
            name: 'John',
            email: 'john@example.com',
          },
        },
      }
      const result = formatter.format('INFO', 'test', context)

      expect(result.context).toEqual(context)
    })

    it('should handle arrays in context', () => {
      const context = {
        items: [1, 2, 3],
        tags: ['a', 'b', 'c'],
      }
      const result = formatter.format('INFO', 'test', context)

      expect(result.context).toEqual(context)
    })
  })
})
