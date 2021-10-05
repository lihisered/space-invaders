'use strict';
console.log('ALIEN');

const ALIEN_SPEED = 500;
var gIntervalAliens;
var gAliensTopRowIdx;
var gAliensBottomRowIdx;
var gIsAlienFreeze = true;
var shiftRight = 0;
var shiftLeft = 6;

function createAliens(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            if (i < ALIENS_ROW_COUNT && j < ALIENS_ROW_LENGTH) currCell.gameObject = ALIEN;
        }
    }
}

function handleAlienHit(pos) {
    gScore += 10;
    gElScore.innerText = gScore;

    gGame.aliensCount--;

    updateCell({ i: pos.i - 1, j: pos.j }, '');
    updateCell(pos, '');

    clearInterval(gLaserInterval);
    gHero.isShoot = false;

    checkIsVictory();
}

function shiftBoardRight(board, fromI, toI) {
    for (var i = fromI; i < toI; i++) {
        for (var j = board.length - 1; j >= 0; j--) {
            if (board[i][j].gameObject === ALIEN) {
                board[i][j + 1].gameObject = ALIEN;
                board[i][j].gameObject = '';
            } else if (board[i][j].gameObject === LASER) {
                handleAlienHit({ i, j })
            }
        }
    }
    renderBoard(board);
}

function shiftBoardLeft(board, fromI, toI) {
    for (var i = fromI; i < toI; i++) {
        for (var j = 0; j <= board[i].length - 1; j++) {
            if (board[i][j].gameObject === ALIEN) {
                board[i][j - 1].gameObject = ALIEN
                board[i][j].gameObject = '';
            } else if (board[i][j].gameObject === LASER) {
                handleAlienHit({ i, j })
            }
        }
    }
    renderBoard(board);
}

function shiftBoardDown(board, fromI, toI) {
    for (var i = fromI; i >= toI; i--) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].gameObject === ALIEN) {
                board[i + 1][j].gameObject = ALIEN;
                board[i][j].gameObject = '';
            } else if (board[i][j].gameObject === LASER) {
                handleAlienHit({ i, j })
            }

        }
    }
    renderBoard(board);
}

function moveAliens() {
    if (gAliensBottomRowIdx === 12) {
        document.querySelector('h3').innerText = 'GAME OVER 😕';
        console.log('Game over...');
        clearInterval(gIntervalAliens);
        clearInterval(gCandyInterval);
        gGame.isOn = false;
        return;
    }
    if (shiftLeft > 0) {
        shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
        shiftLeft--;
        if (shiftLeft <= 0) {
            setTimeout(() => {
                shiftBoardDown(gBoard, gAliensBottomRowIdx, gAliensTopRowIdx);
                gAliensTopRowIdx += 1;
                gAliensBottomRowIdx += 1;
                shiftRight = 6;
            }, ALIEN_SPEED)
        }
    }
    if (shiftRight > 0) {
        shiftBoardLeft(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
        shiftRight--;
        if (shiftRight === 0) {
            setTimeout(() => {
                shiftBoardDown(gBoard, gAliensBottomRowIdx, gAliensTopRowIdx);
                gAliensTopRowIdx += 1;
                gAliensBottomRowIdx += 1;
                shiftLeft = 6;
            }, ALIEN_SPEED)
        }
    }
}