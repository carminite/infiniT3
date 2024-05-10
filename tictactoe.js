/*  Welcome to hell, aka JavaScript canvas animations coded from scratch.
    Everything except for animation times are handled by canvas.
    I... I have many regrets, but this was a fun experience nonetheless :') */

var wid, hei;
const cv = document.getElementById("cv");
const pen = cv.getContext("2d");
var board = new Array(9);
var turn = 0;
var state = 0; // 0 is board animation, 1 is taking input, 2 is cell animation, 3 is strikethrough animation, 4 is erase animation
var lastX = -1;
var lastY = -1;
var winLine = -1, winN = -1;
var animStart;
var win;

function init() {
    wid = window.innerWidth;
    hei = window.innerHeight;
    cv.width = wid;
    cv.height = hei;
    cv.addEventListener('click', function(event) {
        if (state == 1) {
            var x = event.offsetX;
            var y = event.offsetY;
            var centerX = wid / 2;
            var centerY = hei / 2;
            var scale = Math.min(wid, hei) / 400;
            if (Math.abs(x - centerX) <= 150 * scale && Math.abs(y - centerY) <= 150 * scale) updateBoard(Math.floor((x - centerX + 150 * scale) / 100 / scale), Math.floor((y - centerY + 150 * scale) / 100 / scale));
        }
    });
    win = 0;
    for (var i = 0; i < 9; i++) board[i] = -1;
    animStart = Date.now();
    window.requestAnimationFrame(draw);
}

function draw() {
    pen.clearRect(0, 0, wid, hei);
    pen.reset();
    switch (state) {
        case 0:
        newBoard();
        break;
        case 1: 
        drawBoard();
        break;
        case 2:
        newCell(lastX, lastY);
        break;
        case 3:
        strikethrough(winLine, winN);
        break;
        case 4:
        shrinkBoard();
        break;
    }
}

function shrinkBoard() {
    var centerX = wid / 2;
    var centerY = hei / 2;
    var animTime = (Date.now() - animStart) / 1500;
    if (animTime > 1.6) {
        state = 1;
        for (var i = 0; i < 9; i++) board[i] = -1;
        if (win == 1) {
            win = 0;
            board[lastX + 3 * lastY] = 1 - turn;
        }
        drawBoard();
    } else {
        pen.strokeStyle = "saddlebrown";
        pen.lineWidth = 2;
        pen.lineCap = "round";
        pen.translate(centerX, centerY);
        pen.scale(Math.min(wid, hei) / 400, Math.min(wid, hei) / 400);
        pen.save();
        pen.globalAlpha = 1 - easeInOut(animTime);
        pen.translate((-100 + 100 * lastX) * easeInOut(animTime), (-100 + 100 * lastY) * easeInOut(animTime));
        pen.scale(1 - 220 * easeInOut(animTime) / 300, 1 - 220 * easeInOut(animTime) / 300);
        pen.beginPath();
        pen.moveTo(-150, -50);
        pen.lineTo(150, -50);
        pen.moveTo(-150, 50);
        pen.lineTo(150, 50);
        pen.moveTo(-50, 150);
        pen.lineTo(-50, -150);
        pen.moveTo(50, 150);
        pen.lineTo(50, -150);
        pen.stroke();
        for (var i = 0; i < 9; i++) drawCell(board[i], i);
        pen.restore();
        pen.translate((375 - 375 * lastX) * (1 - easeInOut(animTime)), (375 - 375 * lastY) * (1 - easeInOut(animTime)));
        pen.scale(1 + 220 * (1 - easeInOut(animTime)) / 80, 1 + 220 * (1 - easeInOut(animTime)) / 80);
        pen.beginPath();
        pen.moveTo(-150, -50);
        pen.lineTo(-150 + 300 * easeInOut(animTime), -50);
        if (animTime > 0.2) {
            pen.moveTo(-150, 50);
            pen.lineTo(-150 + 300 * easeInOut(animTime - 0.2), 50);
        }
        if (animTime > 0.4) {
            pen.moveTo(-50, -150);
            pen.lineTo(-50, -150 + 300 * easeInOut(animTime - 0.4));
        }
        if (animTime > 0.6) {
            pen.moveTo(50, -150);
            pen.lineTo(50, -150 + 300 * easeInOut(animTime - 0.6));
        }
        pen.stroke();
        pen.beginPath();
        if (win == 1) {
            if (turn == 1) { // If last player was X, then winner was O and vice versa
                pen.strokeStyle = "maroon";
                pen.moveTo(-140 + 100 * lastX, -140 + 100 * lastY);
                pen.lineTo(-140 + 100 * lastX + 80 * easeInOut(animTime * 2), -140 + 100 * lastY + 80 * easeInOut(animTime * 2));
                if (animTime > 0.5) {
                    pen.moveTo(-60 + 100 * lastX, -140 + 100 * lastY);
                    pen.lineTo(-60 + 100 * lastX - 80 * easeInOut(animTime * 2 - 1), -140 + 100 * lastY + 80 * easeInOut(animTime * 2 - 1));
                }
            } else {
                pen.strokeStyle = "darkolivegreen";
                pen.arc(-100 + 100 * lastX, -100 + 100 * lastY, 40, 0, 2 * Math.PI * easeInOut(animTime));
            }
            pen.stroke();
        }
        window.requestAnimationFrame(draw);
    }
}

function newBoard() {
    var centerX = wid / 2;
    var centerY = hei / 2;
    var animTime = (Date.now() - animStart) / 1500;
    if (animTime > 1.6) {
        state = 1;
        animStart = Date.now();
        drawBoard();
    } else {
        pen.strokeStyle = "saddlebrown";
        pen.lineWidth = 2;
        pen.lineCap = "round";
        pen.translate(centerX, centerY);
        pen.scale(Math.min(wid, hei) / 400, Math.min(wid, hei) / 400);
        pen.beginPath();
        pen.moveTo(-150, -50);
        pen.lineTo(-150 + 300 * easeInOut(animTime), -50);
        if (animTime > 0.2) {
            pen.moveTo(-150, 50);
            pen.lineTo(-150 + 300 * easeInOut(animTime - 0.2), 50);
        }
        if (animTime > 0.4) {
            pen.moveTo(-50, -150);
            pen.lineTo(-50, -150 + 300 * easeInOut(animTime - 0.4));
        }
        if (animTime > 0.6) {
            pen.moveTo(50, -150);
            pen.lineTo(50, -150 + 300 * easeInOut(animTime - 0.6));
        }
        pen.stroke();
    }
    window.requestAnimationFrame(draw);
}

function drawBoard() {
    var centerX = wid / 2;
    var centerY = hei / 2;
    pen.strokeStyle = "saddlebrown";
    pen.lineWidth = 2;
    pen.lineCap = "round";
    pen.translate(centerX, centerY);
    pen.scale(Math.min(wid, hei) / 400, Math.min(wid, hei) / 400);
    pen.beginPath();
    pen.moveTo(-150, -50);
    pen.lineTo(150, -50);
    pen.moveTo(-150, 50);
    pen.lineTo(150, 50);
    pen.moveTo(-50, 150);
    pen.lineTo(-50, -150);
    pen.moveTo(50, 150);
    pen.lineTo(50, -150);
    pen.stroke();
    for (var i = 0; i < 9; i++) drawCell(board[i], i);
}

function drawCell(e, i) {
    if (e == 0) {
        pen.strokeStyle = "maroon";
        drawX(i % 3, Math.floor(i / 3));
    } else if (e == 1) {
        pen.strokeStyle = "darkolivegreen";
        drawO(i % 3, Math.floor(i / 3));
    }
}

function drawX(x, y) {
    pen.beginPath();
    pen.moveTo(-140 + 100 * x, -140 + 100 * y);
    pen.lineTo(-60 + 100 * x, -60 + 100 * y);
    pen.moveTo(-140 + 100 * x, -60 + 100 * y);
    pen.lineTo(-60 + 100 * x, -140 + 100 * y);
    pen.stroke();
}

function drawO(x, y) {
    pen.beginPath();
    pen.arc(-100 + 100 * x, -100 + 100 * y, 40, 0, 2 * Math.PI);
    pen.stroke();
}

function newCell(x, y) {
    var animTime = (Date.now() - animStart) / 1000;
    if (animTime > 1) {
        state = 1;
        board[x + y * 3] = turn;
        turn = 1 - turn;
        drawBoard();
        var [line, i] = checkBoard();
        if (line >= 0) {
            state = 3;
            winLine = line;
            winN = i;
            win = 1;
            animStart = Date.now();
            window.requestAnimationFrame(draw);
        } else if (fullBoard()) {
            state = 4;
            animStart = Date.now();
            window.requestAnimationFrame(draw);
        }
    } else {
        drawBoard();
        pen.beginPath();
        if (turn == 0) {
            pen.strokeStyle = "maroon";
            pen.moveTo(-140 + 100 * x, -140 + 100 * y);
            pen.lineTo(-140 + 100 * x + 80 * easeInOut(animTime * 2), -140 + 100 * y + 80 * easeInOut(animTime * 2));
            if (animTime > 0.5) {
                pen.moveTo(-60 + 100 * x, -140 + 100 * y);
                pen.lineTo(-60 + 100 * x - 80 * easeInOut(animTime * 2 - 1), -140 + 100 * y + 80 * easeInOut(animTime * 2 - 1));
            }
        } else {
            pen.strokeStyle = "darkolivegreen";
            pen.arc(-100 + 100 * x, -100 + 100 * y, 40, 0, 2 * Math.PI * easeInOut(animTime));
        }
        pen.stroke();
        window.requestAnimationFrame(draw);
    }
}

function fullBoard() {
    for (let i of board) if (i == -1) return false;
    return true;
}

function updateBoard(x, y) {
    if (board[x + y * 3] == -1) {
        state = 2;
        lastX = x;
        lastY = y;
        animStart = Date.now();
        window.requestAnimationFrame(draw);
    }
}

function checkBoard() { 
    for (i = 0; i < 3; i++) if (board[i] >= 0 && board[i] == board[i + 3] && board[i] == board[i + 6]) return [1, i];
    for (i = 0; i < 3; i++) if (board[i * 3] >= 0 && board[i * 3] == board[i * 3 + 1] && board[i * 3] == board[i * 3 + 2]) return [0, i];
    if (board[0] >= 0 && board[0] == board[4] && board[0] == board[8]) return [2, -1];
    if (board[2] >= 0 && board[2] == board[4] && board[2] == board[6]) return [3, -1];
    return [-1, -1];
}

function strikethrough(line, i) {
    drawBoard();
    var animTime = (Date.now() - animStart) / 500;
    if (animTime > 2) {
        state = 4;
        animStart = Date.now();
    } else {
        pen.save();
        pen.strokeStyle = "saddlebrown";
        pen.globalAlpha = 0.5
        pen.lineWidth = 15;
        pen.lineCap = "round";
        pen.beginPath();
        switch (line) {
            case 0: 
            pen.moveTo(-150 + 300 * easeInOut(animTime - 1), -100 + i * 100);
            pen.lineTo(-150 + 300 * easeInOut(animTime), -100 + i * 100);
            break;
            case 1: 
            pen.moveTo(-100 + i * 100, -150 + 300 * easeInOut(animTime - 1));
            pen.lineTo(-100 + i * 100, -150 + 300 * easeInOut(animTime));
            break;
            case 2:
            pen.moveTo(-140 + 280 * easeInOut(animTime - 1), -140 + 280 * easeInOut(animTime - 1));
            pen.lineTo(-140 + 280 * easeInOut(animTime), -140 + 280 * easeInOut(animTime));
            break;
            case 3:
            pen.moveTo(140 - 280 * easeInOut(animTime - 1), -140 + 280 * easeInOut(animTime - 1));
            pen.lineTo(140 - 280 * easeInOut(animTime), -140 + 280 * easeInOut(animTime));
            break;
        }
        pen.stroke();
        pen.restore();
    }
    window.requestAnimationFrame(draw);
}

window.addEventListener('resize', function(event){
    wid = window.innerWidth;
    hei = window.innerHeight;
    cv.width = wid;
    cv.height = hei;
    window.requestAnimationFrame(draw);
});

function easeInOut(x) {
    return -(Math.cos(Math.PI * Math.max(0, (Math.min(1, x)))) - 1) / 2
}

init();