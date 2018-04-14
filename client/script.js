window.onload = () => {
    const socket = io();
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let player;

    // on start event resize canvas and name the player
    socket.on('start', (start) => {
        player = start.player;
        canvas.width = start.stage.width;
        canvas.height = start.stage.height;
        ctx.fillStyle = player;
        ctx.font = '48px serif';
    });

    socket.on('play', (result) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'yellow';
        ctx.fillRect(result.players.yellow.x - 60, canvas.height - 40, 120, 20);
        ctx.fillText(result.players.yellow.score, 10, canvas.height - 20);
        ctx.fillStyle = 'red';
        ctx.fillRect(result.players.red.x - 60, 20, 120, 20);
        ctx.fillText(result.players.red.score, 10, 50);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 2, canvas.height);
        ctx.fillRect(canvas.width - 2, 0, 2, canvas.height);
        ctx.beginPath();
        ctx.arc(result.ball.x, result.ball.y, result.ball.size * 2, 0, 2 * Math.PI);
        ctx.fill();
    })

    canvas.addEventListener('mousemove', (event) => socket.emit(player, event.x - canvas.offsetLeft), true);
}