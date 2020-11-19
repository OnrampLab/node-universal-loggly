# universal-loggly

## feature
- send log to Loggly

## how to install
- yarn add universal-loggly

## include example
- vi /your-project/app.js
```js
  // for library
  import { LogglyClient } from 'universal-loggly';

  // you can custom myself helper
  export function factoryLogglyClient() {
    return new LogglyClient(`<loggly host>`, 'token', 'secret')
  }
```

## sample code
```js
import { factoryLogglyClient } from 'universal-loggly-helper';

const logger = factoryLogglyClient();
const message = 'test message';
const redirectUrl = 'https://duckduckgo.com/';
const promise = logger.info(message, {
  extend_content: true,
});

promise.then(function(data) {
  // success
})
.catch(function(error) {
  console.error(`[universal-loggly]: ${error}`);
})
.finally(function() {
  window.location.href = redirectUrl;
});
```

## plan of future
- storage cookie
- send hook
