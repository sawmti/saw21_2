[![Continuous integration for SAW template](https://github.com/sawmti/saw21_2/actions/workflows/ci.yml/badge.svg)](https://github.com/sawmti/saw21_2/actions/workflows/ci.yml)

# Project structure

This repository contains a simple skeleton of a web page which contains a REST service implemented in Node and a simple Web client that invokes the service. 

- [client](https://github.com/sawmti/saw21_2/tree/main/client) contains the source code of the web client (html/css/javascript files)
- [api](https://github.com/sawmti/saw21_2/tree/main/api) contains the source code of the REST API

## Running locally

If you want to execute the project you will need 
[Node.js and npm](https://www.npmjs.com/get-npm). 

Compile and run the web app:

```
npm install
npm start
```

You should be able to access the application in [http://localhost:3000](http://localhost:3000).

## Running from Docker

It is possible to run the application from docker with

```
docker build -t "saw212" .
docker run saw212
```

or 

```
docker-compose up
```

## Contributors

- [Jose Emilio Labra Gayo](http://labra.weso.es)

## Credits

This skeleton is based on a [similar skeleton](https://github.com/Arquisoft/radarin_0) created by [Pablo González](https://github.com/pglez82) which is a bit more complex because the web client is implemented as a [React application](https://reactjs.org/) and the server contains monitoring and load testing.
