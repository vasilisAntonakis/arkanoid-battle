# Arkanoid Battle
This is an experimental project in node.js using [express.js](https://expressjs.com/) and [socket.io](https://socket.io/) modules.
It uses web sockets to read each players x coordinate in canvas html element from mousemovement event, and to send the calculated data in order to be drawn every 20ms.
This game can be played by 2 players. Other connections will be registered as spectators.
When a player leaves the game, the oldest spectator will be the new player (against the old one).
## Serve the game
1. make sure you have node.js installed
2. download and `npm install`
3. `npm start`
4. it will log the server's ip and port
## Play the game
1. visit server in any browser
2. if a player is available you instantly controll it
3. otherwise spectate the game until a player leaves
## enjoy