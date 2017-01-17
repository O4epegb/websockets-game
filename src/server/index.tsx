import * as path from 'path';
import * as http from 'http';
import * as express from 'express';
import * as socketio from 'socket.io';
import { startTheGame } from './game';
// import * as React from 'react';
// import * as ReactDOMServer from 'react-dom/server';
// import { App } from '../client';

const app = express();
const server = (http as any).Server(app);
const socket = socketio.listen(server);

app.set('port', (process.env.PORT || 8000));

app.use(express.static(path.join(__dirname)));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

const template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>App kek</title>
</head>
<body>
    <div id="root">
    ${'kek'/*|| ReactDOMServer.renderToString(<App />)*/}
    </div>
    <script src="./client.js"></script>
</body>
</html>`;

app.get('/', function(req, res) {
    res.send(template);
});

server.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});

startTheGame(socket);
