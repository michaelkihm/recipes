# Recipes

WebApp with list of recipes and user settings to add or comment recipes.


## Tech Stack
Mongo DB
Express
Angular
NodeJs

## Dependencies
- [nodejs](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)
- [Docker-compose](https://docs.docker.com/compose/)

## IDE
VSCode

## Frontend 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.1.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
## Get up and running
Install all dependencies with 
```
npm i
```
### Frontend
```
ng serve
```

### Backend
To migrate some test data to the test db
```
npm run migrate:testData
```
Start dev db with
```
docker-compose -f docker-compose.dev.yml up -d mongodb_container
```

To start the development server run
```
npm run compile:server
```
to compile typescript code. In another terminal start server by 
```
npm run start:server
```


## Debugging
### Frontend 
If you are using VS Code you can use the debugger configured in the [launch](.vscode/launch.json) file (Launch Edge against localhost). However, for using the debugger you have to download the [Microsoft Edge Tools for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-edgedevtools.vscode-edge-devtools) extension and the [Microsoft Edge](https://www.microsoft.com/en-us/edge) browser. Then run
```
cd frontend
ng serve
```
and start the Launch Edge against localhost debugger. 

### Backend
If you are using VS Code you can use the debugger configured in the [launch](.vscode/launch.json) file (Launch Backend).
## Testing

### Frontend Unit tests
```
ng test
```
### Backend
```
npm run setupTestDB:backend
npm run test:backend
npm run stopTestDB:backend
```