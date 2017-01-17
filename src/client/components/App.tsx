import * as React from 'react';
import { socket } from '../socket';


export class App extends React.Component<{}, {}> {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor() {
        super();
        this.state = {

        };
    }

    componentDidMount() {
        this.ctx.font = '30px Arial';
        socket.on('newPositions', (data) => {
            this.ctx.clearRect(0, 0, 500, 500);
            for (var i = 0; i < data.player.length; i++)
                this.ctx.fillText(data.player[i].number, data.player[i].x, data.player[i].y);

            for (var i = 0; i < data.bullet.length; i++)
                this.ctx.fillRect(data.bullet[i].x - 5, data.bullet[i].y - 5, 10, 10);
        });

        document.onkeydown = function(event) {
            if (event.keyCode === 68) {
                socket.emit('keyPress', { inputId: 'right', state: true });
            } else if (event.keyCode === 83) {
                socket.emit('keyPress', { inputId: 'down', state: true });
            } else if (event.keyCode === 65) {
                socket.emit('keyPress', { inputId: 'left', state: true });
            } else if (event.keyCode === 87) {
                socket.emit('keyPress', { inputId: 'up', state: true });
            }
        };

        document.onkeyup = function(event) {
            if (event.keyCode === 68) {
                socket.emit('keyPress', { inputId: 'right', state: false });
            } else if (event.keyCode === 83) {
                socket.emit('keyPress', { inputId: 'down', state: false });
            } else if (event.keyCode === 65) {
                socket.emit('keyPress', { inputId: 'left', state: false });
            } else if (event.keyCode === 87) {
                socket.emit('keyPress', { inputId: 'up', state: false });
            }
        };
    }

    render() {
        return (
            <div>
                <canvas ref={node => (this.canvas = node, this.ctx = node.getContext('2d'))} width="500" height="500" />
            </div>
        );
    }
}
