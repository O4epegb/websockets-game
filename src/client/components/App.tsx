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
            for (var i = 0; i < data.length; i++) {
                this.ctx.fillText(data[i].number, data[i].x, data[i].y);
            }
        });

        document.onkeydown = function(event) {
            if (event.keyCode === 68)	// d
                socket.emit('keyPress', { inputId: 'right', state: true });
            else if (event.keyCode === 83)	// s
                socket.emit('keyPress', { inputId: 'down', state: true });
            else if (event.keyCode === 65) // a
                socket.emit('keyPress', { inputId: 'left', state: true });
            else if (event.keyCode === 87) // w
                socket.emit('keyPress', { inputId: 'up', state: true });
        };

        document.onkeyup = function(event) {
            if (event.keyCode === 68)	// d
                socket.emit('keyPress', { inputId: 'right', state: false });
            else if (event.keyCode === 83)	// s
                socket.emit('keyPress', { inputId: 'down', state: false });
            else if (event.keyCode === 65) // a
                socket.emit('keyPress', { inputId: 'left', state: false });
            else if (event.keyCode === 87) // w
                socket.emit('keyPress', { inputId: 'up', state: false });
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
