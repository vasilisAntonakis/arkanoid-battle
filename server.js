'use strict'
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const Ball = require('./ball.js');
app.use(express.static(__dirname + '/client'));

const stage = {
    width: 1000,
    height: 600
}

const spectators = [];

const players = {
    yellow: { id: undefined, x: -200, score: 0 },
    red: { id: undefined, x: -200, score: 0 }
}

const ball = new Ball(stage);

io.on('connection', (socket) => {

    if (!players.yellow.id) {
        players.yellow.id = socket.id;
        socket.emit('start', { player: 'yellow', stage });
        console.log('yellow player connected');
    } else if (!players.red.id) {
        players.red.id = socket.id;
        socket.emit('start', { player: 'red', stage });
        console.log('red player connected');
    } else {
        console.log('spectator connected');
        spectators.push(socket.id);
        socket.emit('start', { stage });
    }

    socket.on('red', (rx) => players.red.x = rx);
    socket.on('yellow', (yx) => players.yellow.x = yx);
    setInterval(() => socket.emit('play', ball.move(players.yellow, players.red)), 30);

    socket.on('disconnect', () => {
        if (players.yellow.id === socket.id) {
            if (spectators.length > 0) {
                players.yellow.id = spectators[0];
                socket.broadcast.to(spectators[0]).emit('start', { player: 'yellow', stage });
                spectators.splice(0, 1);
                console.log('yellow player switched');
            } else {
                players.yellow.id = undefined;
                players.yellow.x = -200;
                console.log('yellow player disconnected');
            }
            players.yellow.score = 0;
        } else if (players.red.id === socket.id) {
            if (spectators.length > 0) {
                players.red.id = spectators[0];
                socket.broadcast.to(spectators[0]).emit('start', { player: 'red', stage });
                spectators.splice(0, 1);
                console.log('red player switched');
            } else {
                players.red.id = undefined;
                players.red.x = -200;
                console.log('red player disconnected');
            }
            players.red.score = 0;
        } else {
            spectators.splice(spectators.indexOf(socket.id), 1);
            console.log('spectator disconnected');
        }
    });
});

http.listen(3000, () => {
    // const ip = require('os').networkInterfaces()['Ethernet'].filter(ni => ni.family === 'IPv4')[0].address
    // console.log(`server started on: http://${ip}:3000`);
});
