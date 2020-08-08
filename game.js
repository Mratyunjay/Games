var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var interval;

//for the ball
var x = canvas.width / 2;
var y = canvas.height - 30;
var t = 7;
var dx = 2;
var dy = -2;
var dt = 0;
var ballRadius = 10;
const ballColor = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
};
var ballCol = ballColor();

//the paddle
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;

//bricks
var brickRowCount = 1;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

var score = 0;
var levelScore = 0;
var lives = 3;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    ballCol = ballColor();
                    score++;
                    levelScore++;
                    if (levelScore == brickRowCount * brickColumnCount && brickRowCount <= 8) {
                        brickRowCount++;
                        levelScore = 0;
                        for (var c = 0; c < brickColumnCount; c++) {
                            bricks[c] = [];
                            for (var r = 0; r < brickRowCount; r++) {
                                bricks[c][r] = { x: 0, y: 0, status: 1 };
                            }
                        }
                        x = canvas.width / 2;
                        y = canvas.height - 30;
                        dx = 2;
                        dy = -2;
                        lives++;
                        paddleX = (canvas.width - paddleWidth) / 2;
                    } else if (levelScore == brickRowCount * brickColumnCount && brickRowCount == 8) {
                        alert("Things are gonna get speedy now");
                        brickRowCount == 3;
                        t++;
                        clearInterval(interval);
                        interval = setInterval(draw, t + dt);
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballCol;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks()
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
        dt = 0;
        clearInterval(interval);
        interval = setInterval(draw, t + dt);
    }
    if (y + dy < ballRadius) {
        dy = -dy;
        dt = 0
        clearInterval(interval);
        interval = setInterval(draw, t + dt);
    } else if (y + dy > canvas.height - ballRadius) {
        if (x + ballRadius > paddleX && x - ballRadius < paddleX + paddleWidth) {
            dy = -dy;
            dt = -2;
            clearInterval(interval);
            interval = setInterval(draw, t + dt);
        } else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
                t = 7;
                dt = 0;
                lives = 3;
                score = 0;
                levelScore = 0;
                brickRowCount = 1;
                for (var c = 0; c < brickColumnCount; c++) {
                    bricks[c] = [];
                    for (var r = 0; r < brickRowCount; r++) {
                        bricks[c][r] = { x: 0, y: 0, status: 1 };
                    }
                }
                clearInterval(interval);
                interval = setInterval(draw, t + dt);
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 6;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 6;
    }

    x += dx;
    y += dy;
}
interval = setInterval(draw, t + dt);