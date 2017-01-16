import * as path from 'path';
import * as http from 'http';
import * as express from 'express';
import * as socketio from 'socket.io';
// import * as React from 'react';
// import * as ReactDOMServer from 'react-dom/server';
// import { App } from '../client';

const app = express();
const server = (http as any).Server(app);
const io = socketio.listen(server);

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


const SOCKET_LIST = {};
const PLAYER_LIST = {};

var Player = function(id) {
    var self = {
        x: 250,
        y: 250,
        id: id,
        number: String(Math.floor(10 * Math.random())),
        pressingRight: false,
        pressingLeft: false,
        pressingUp: false,
        pressingDown: false,
        maxSpd: 10,
    } as any;
    self.updatePosition = function() {
        if (self.pressingRight)
            self.x += self.maxSpd;
        if (self.pressingLeft)
            self.x -= self.maxSpd;
        if (self.pressingUp)
            self.y -= self.maxSpd;
        if (self.pressingDown)
            self.y += self.maxSpd;
    };
    return self;
};

io.sockets.on('connection', function(socket) {
    socket.id = String(Math.random());
    SOCKET_LIST[socket.id] = socket;

    var player = Player(socket.id);
    PLAYER_LIST[socket.id] = player;

    socket.on('disconnect', function() {
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    });

    socket.on('keyPress', function(data) {
        if (data.inputId === 'left')
            player.pressingLeft = data.state;
        else if (data.inputId === 'right')
            player.pressingRight = data.state;
        else if (data.inputId === 'up')
            player.pressingUp = data.state;
        else if (data.inputId === 'down')
            player.pressingDown = data.state;
    });


});

setInterval(function() {
    var pack = [];
    for (var i in PLAYER_LIST) {
        var player = PLAYER_LIST[i];
        player.updatePosition();
        pack.push({
            x: player.x,
            y: player.y,
            number: player.number
        });
    }
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('newPositions', pack);
    }
}, 1000 / 25);
