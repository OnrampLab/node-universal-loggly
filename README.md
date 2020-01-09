# universal-loggly

## feature
- send log to Loggly

## how to build
- yarn dev
- yarn prod

## laravel dependency
- .env
- .env.example

## API dependency
- Loggly fetch url API

## node dependency
- yarn add cross-fetch

## webpack dependency
- yarn add dotenv-webpack 

## include example
- vi /your-project/app.js
```js
  // from origin
  import { LogglyClient } from 'universal-loggly';

  // from custom helper
  import { factoryLogglyClient } from 'universal-loggly-helper';
```

## sample code
```js
import { factoryLogglyClient } from 'universal-loggly-helper';

const message = 'test message';
const redirectUrl = 'https://duckduckgo.com/';
const promise = logger.info(message);

promise.then(function(data) {
  // success
})
.catch(function(error) {
  // skip
})
.finally(function() {
  window.location.href = redirectUrl;
});
```

## for develop library
```
cd /var/www/library-app
yarn link
> success Registered "library-app"

cd /var/www/your-main-project
yarn link "library-app"
> success Using linked package for "library-app"

yarn unlink "library-app"
> success Removed linked package "library-app"
```

## plan of future
- ES8 async/await
- storage cookie
- send hook
