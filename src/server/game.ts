const socketList = {};
const playerList: Record<string, Player> = {};
const bulletList: Record<string, Bullet> = {};

class Entity {
    x = 250;
    y = 250;
    spdX = 0;
    spdY = 0;
    id = '';

    update() {
        this.updatePosition();
    }

    updatePosition() {
        this.x = this.x + this.spdX;
        this.y = this.y + this.spdY;
    }
}

class Player extends Entity {
    number = '' + Math.floor(10 * Math.random());
    pressingRight = false;
    pressingLeft = false;
    pressingUp = false;
    pressingDown = false;
    maxSpd = 10;

    constructor(id: string) {
        super();
        this.id = id;
        playerList[id] = this;
    }

    update() {
        this.updateSpd();
        super.update();
    }

    updateSpd() {
        if (this.pressingRight) {
            this.spdX = this.maxSpd;
        } else if (this.pressingLeft) {
            this.spdX = -this.maxSpd;
        } else {
            this.spdX = 0;
        }

        if (this.pressingUp) {
            this.spdY = -this.maxSpd;
        } else if (this.pressingDown) {
            this.spdY = this.maxSpd;
        } else {
            this.spdY = 0;
        }
    }

    static onDisconnect = socket => {
        delete playerList[socket.id];
    };

    static update = () => {
        const pack = [];
        for (const i in playerList) {
            if (playerList.hasOwnProperty(i)) {
                const player = playerList[i];
                player.update();
                pack.push({
                    x: player.x,
                    y: player.y,
                    number: player.number
                });
            }
        }
        return pack;
    };
}

class Bullet extends Entity {
    id = String(Math.random());
    spdX = 0;
    spdY = 0;
    timer = 0;
    toRemove = false;

    constructor(angle: number) {
        super();
        this.spdX = Math.cos((angle / 180) * Math.PI) * 10;
        this.spdY = Math.sin((angle / 180) * Math.PI) * 10;
        bulletList[this.id] = this;
    }

    update() {
        if (this.timer++ > 100) {
            this.toRemove = true;
        }
        super.update();
    }

    static update = () => {
        if (Math.random() < 0.1) {
            createBullet();
        }

        const pack = [];
        for (const i in bulletList) {
            if (bulletList.hasOwnProperty(i)) {
                const bullet = bulletList[i];
                bullet.update();
                pack.push({
                    x: bullet.x,
                    y: bullet.y
                });
            }
        }
        return pack;
    };
}

function createPlayer(socket) {
    const player = new Player(socket.id);
    socket.on('keyPress', data => {
        if (data.inputId === 'left') {
            player.pressingLeft = data.state;
        } else if (data.inputId === 'right') {
            player.pressingRight = data.state;
        } else if (data.inputId === 'up') {
            player.pressingUp = data.state;
        } else if (data.inputId === 'down') {
            player.pressingDown = data.state;
        }
    });
    playerList[player.id] = player;
}

function createBullet() {
    const bullet = new Bullet(Math.random() * 360);
    bulletList[bullet.id] = bullet;
}

export function startTheGame(io: SocketIO.Server) {
    io.sockets.on('connection', socket => {
        (socket as any).id = Math.random();
        socketList[socket.id] = socket;

        createPlayer(socket);

        socket.on('disconnect', () => {
            delete socketList[socket.id];
            Player.onDisconnect(socket);
        });
    });

    setInterval(() => {
        const pack = {
            player: Player.update(),
            bullet: Bullet.update()
        };

        for (const i in socketList) {
            if (socketList.hasOwnProperty(i)) {
                const socket = socketList[i];
                socket.emit('newPositions', pack);
            }
        }
    }, 1000 / 25);
}
