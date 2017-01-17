export function startTheGame(io: SocketIO.Server) {
    var SOCKET_LIST = {};

    class Entity1 {
        x = 250;
        y = 250;
        spdX = 0;
        spdY = 0;
        id = '';

        constructor() {

        }

        update() {
            this.updatePosition();
        }

        updatePosition() {
            this.x += this.spdX;
            this.y += this.spdY;
        }
    }

    class Player1 extends Entity1 {
        number = '' + Math.floor(10 * Math.random());
        pressingRight = false;
        pressingLeft = false;
        pressingUp = false;
        pressingDown = false;
        maxSpd = 10;

        constructor(id: string) {
            super();
            this.id = id;
        }

        update() {
            this.updateSpd();
            super.update();
        };


        updateSpd() {
            if (this.pressingRight)
                this.spdX = this.maxSpd;
            else if (this.pressingLeft)
                this.spdX = -this.maxSpd;
            else
                this.spdX = 0;

            if (this.pressingUp)
                this.spdY = -this.maxSpd;
            else if (this.pressingDown)
                this.spdY = this.maxSpd;
            else
                this.spdY = 0;
        };
    }

    var Entity = function() {
        var self = {
            x: 250,
            y: 250,
            spdX: 0,
            spdY: 0,
            id: '',
        } as any;
        self.update = function() {
            self.updatePosition();
        };
        self.updatePosition = function() {
            self.x += self.spdX;
            self.y += self.spdY;
        };
        return self;
    };

    var Player = function(id) {
        var self = Entity();
        self.id = id;
        self.number = '' + Math.floor(10 * Math.random());
        self.pressingRight = false;
        self.pressingLeft = false;
        self.pressingUp = false;
        self.pressingDown = false;
        self.maxSpd = 10;

        var super_update = self.update;
        self.update = function() {
            self.updateSpd();
            super_update();
        };


        self.updateSpd = function() {
            if (self.pressingRight)
                self.spdX = self.maxSpd;
            else if (self.pressingLeft)
                self.spdX = -self.maxSpd;
            else
                self.spdX = 0;

            if (self.pressingUp)
                self.spdY = -self.maxSpd;
            else if (self.pressingDown)
                self.spdY = self.maxSpd;
            else
                self.spdY = 0;
        };
        (Player as any).list[id] = self;
        return self;
    };
    (Player as any).list = {};
    (Player as any).onConnect = function(socket) {
        var player = Player(socket.id);
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
    };
    (Player as any).onDisconnect = function(socket) {
        delete (Player as any).list[socket.id];
    };
    (Player as any).update = function() {
        var pack = [];
        for (var i in (Player as any).list) {
            var player = (Player as any).list[i];
            player.update();
            pack.push({
                x: player.x,
                y: player.y,
                number: player.number
            });
        }
        return pack;
    };


    var Bullet = function(angle) {
        var self = Entity();
        self.id = Math.random();
        self.spdX = Math.cos(angle / 180 * Math.PI) * 10;
        self.spdY = Math.sin(angle / 180 * Math.PI) * 10;

        self.timer = 0;
        self.toRemove = false;
        var super_update = self.update;
        self.update = function() {
            if (self.timer++ > 100)
                self.toRemove = true;
            super_update();
        };
        (Bullet as any).list[self.id] = self;
        return self;
    };
    (Bullet as any).list = {};

    (Bullet as any).update = function() {
        if (Math.random() < 0.1) {
            Bullet(Math.random() * 360);
        }

        var pack = [];
        for (var i in (Bullet as any).list) {
            var bullet = (Bullet as any).list[i];
            bullet.update();
            pack.push({
                x: bullet.x,
                y: bullet.y,
            });
        }
        return pack;
    };

    io.sockets.on('connection', function(socket) {
        (socket as any).id = Math.random();
        SOCKET_LIST[socket.id] = socket;

        (Player as any).onConnect(socket);

        socket.on('disconnect', function() {
            delete SOCKET_LIST[socket.id];
            (Player as any).onDisconnect(socket);
        });




    });

    setInterval(function() {
        var pack = {
            player: (Player as any).update(),
            bullet: (Bullet as any).update(),
        };

        for (var i in SOCKET_LIST) {
            var socket = SOCKET_LIST[i];
            socket.emit('newPositions', pack);
        }
    }, 1000 / 25);
}
