import * as path from 'path';
import * as http from 'http';
import * as express from 'express';
import * as socketio from 'socket.io';
import { startTheGame } from './game';

const app = express();
const server = (http as any).Server(app);
const socket = socketio.listen(server, {
    serveClient: false,
});

app.set('port', process.env.PORT || 8000);

app.use(express.static(path.join(__dirname)));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Cache-Control', 'no-cache');
    next();
});

const template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>App kek</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
</head>
<body>
    <div id="root">
    </div>
    <script src="./client.js"></script>
</body>
</html>`;

app.get('/', (req, res) => {
    res.send(template);
});

server.listen(app.get('port'), () => {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});

startTheGame(socket);
