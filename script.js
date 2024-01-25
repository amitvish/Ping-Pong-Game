const canvas = document.getElementById("pongCanvas");
const context = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restartButton");
const popup = document.getElementById("popup");

canvas.width = 600;
canvas.height = 400;

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "BLACK"
};

const player = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: "BLACK",
    score: 0,
    velocityY: 0
};

const computer = {
    x: 0,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: "BLACK",
    score: 0
};

let score = 0;
let isGameActive = false;
let animationFrameId;

function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

function collision(b, p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    return b.right > p.left && b.top < p.bottom && b.left < p.right && b.bottom > p.top;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 7;
    ball.velocityX = -ball.velocityX;
    ball.velocityY = -ball.velocityY;
}

function update() {
    if (!isGameActive) return;

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    computer.y = ball.y - computer.height / 2;

    if ((player.y > 0 && player.velocityY < 0) || (player.y < canvas.height - player.height && player.velocityY > 0)) {
        player.y += player.velocityY;
    }

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    let playerPaddle = (ball.x < canvas.width / 2) ? computer : player;
    if (collision(ball, playerPaddle)) {
        let collidePoint = ball.y - (playerPaddle.y + playerPaddle.height / 2);
        collidePoint = collidePoint / (playerPaddle.height / 2);
        let angleRad = collidePoint * Math.PI / 4;
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        ball.speed += 0.1;
        score++;
    }

    if (ball.x + ball.radius > canvas.width) {
        cancelAnimationFrame(animationFrameId);
        scoreDisplay.innerHTML = 'Score: ' + score;
        popup.style.display = 'flex';
        isGameActive = false;
    }
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function game() {
    update();
    render();
    if (isGameActive) {
        animationFrameId = requestAnimationFrame(game);
    }
}

restartButton.addEventListener('click', function() {
    resetBall();
    score = 0;
    scoreDisplay.innerHTML = '';
    popup.style.display = 'none';
});

document.addEventListener("keydown", function(event) {
    if (event.keyCode === 38 || event.keyCode === 40) {
        if (!isGameActive) {
            isGameActive = true;
            animationFrameId = requestAnimationFrame(game);
        }
    }

    switch(event.keyCode) {
        case 38: // Up arrow
            player.velocityY = -6;
            break;
        case 40: // Down arrow
            player.velocityY = 6;
            break;
    }
});

document.addEventListener("keyup", function(event) {
    switch(event.keyCode) {
        case 38: // Up arrow
        case 40: // Down arrow
            player.velocityY = 0;
            break;
    }
});

// Initial call to start the game loop
game();
