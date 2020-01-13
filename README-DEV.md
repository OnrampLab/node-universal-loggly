# DEVELOP

## how to build
- yarn dev
- yarn prod

## 如何利用 yarn link 做開發中的專案鏈結
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

## API dependency
- Loggly fetch url API

## node dependency
- yarn add cross-fetch

## webpack dependency
- yarn add dotenv-webpack 
