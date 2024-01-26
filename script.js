const canvas = document.getElementById("pongCanvas");
const context = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameOverPopup = document.getElementById("gameOver");
const restartButton = document.getElementById("restartButton");

canvas.width = 600;
canvas.height = 400;

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    velocityX: 7,
    velocityY: 7,
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
    ball.velocityX = 7;
    ball.velocityY = 7;
    ball.speed = 7;
}

function update() {
    if (!isGameActive) return;

    // Predict the ball's next position
    let nextBallX = ball.x + ball.velocityX;
    let nextBallY = ball.y + ball.velocityY;

    // AI to control the computer paddle
    computer.y = ball.y - computer.height / 2;

    // Player paddle movement
    if ((player.y > 0 && player.velocityY < 0) || (player.y < canvas.height - player.height && player.velocityY > 0)) {
        player.y += player.velocityY;
    }

    // Ball collision with top and bottom
    if (nextBallY + ball.radius > canvas.height || nextBallY - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    let playerPaddle = (nextBallX < canvas.width / 2) ? computer : player;

    // Check for collision with the paddle
    if (collision(ball, playerPaddle)) {
        let collidePoint = nextBallY - (playerPaddle.y + playerPaddle.height / 2);
        collidePoint = collidePoint / (playerPaddle.height / 2);
        let angleRad = collidePoint * Math.PI / 4;
        let direction = (nextBallX < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        ball.speed += 0.5; // Increased acceleration rate
        score++;
    }

    // Check if the ball has clearly passed the paddle
    if ((ball.x + ball.radius < 0 || ball.x - ball.radius > canvas.width) && !collision(ball, playerPaddle)) {
        cancelAnimationFrame(animationFrameId);
        scoreElement.textContent = score;
        gameOverPopup.style.display = 'block';
        isGameActive = false;
        return;
    }

    // Update the ball's position
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
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
    gameOverPopup.style.display = 'none';
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

game();
