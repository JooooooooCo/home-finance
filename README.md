# Home Finance ![Logo](./src/assets/docs/logo-s.png?raw=true "Logo")


## About

Home finance is an app created for manage personal finance.

## APP

This repo is the frontend for Home Finance app.

It was built with:
<div>
<img src="./src/assets/docs/vue-logo.png" alt="vue" height="30"/>
&nbsp;
<img src="./src/assets/docs/pinia-logo.png" alt="pinia" height="30"/>
&nbsp;
<img src="./src/assets/docs/vuerouter-logo.png" alt="vuerouter" height="30"/>
&nbsp;
<img src="./src/assets/docs/vuetify-logo.png" alt="vuetify" height="30"/>
</div>


## Installation
After download the project, rename the file `.env.example` to `.env` and add your API host in the variables:

```
VUE_APP_ROOT_API=http://localhost:8001/api
```

Now, you will need `docker` installed. Run this command to build and up the docker container:

```
$ docker compose up -d
```

Great, now the APP is available at `127.0.0.1:8085`

## Aditional commands


### Add new packages with container running
```
$ docker compose exec home_finance npm install <package>
```

### Compiles and hot-reloads for development
```
$ docker exec home_finance npm run serve
```

### Compiles and minifies for production
```
$ docker exec home_finance npm run build
```

### Run your unit tests
```
$ docker exec home_finance npm run test:unit
```

## I hope you enjoy it! 8)