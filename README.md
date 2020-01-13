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
  import { factoryLogglyClient } from 'universal-loggly-helper';
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
- ES8 async/await
- storage cookie
- send hook
