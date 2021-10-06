'use strict';
console.log('ALIEN');

const ALIEN_SPEED = 500;
var gIntervalAliens;
var gAliensTopRowIdx;
var gAliensBottomRowIdx;
// var gIsAlienFreeze = true;
var gIsRight = true;

function createAliens(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            if (i === gAliensTopRowIdx && j < ALIENS_ROW_LENGTH) currCell.gameObject = ALIEN1;
            else if (i === gAliensTopRowIdx + 1 && j < ALIENS_ROW_LENGTH) currCell.gameObject = ALIEN2;
            else if (i === gAliensBottomRowIdx - 1 && j < ALIENS_ROW_LENGTH) currCell.gameObject = ALIEN3;
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

function addAlien(board, i, j, alien) {
    board[i][j].gameObject = alien;
}

function shiftBoardRight(board, fromI, toI) {
    for (var i = fromI; i < toI; i++) {
        for (var j = board.length - 1; j >= 0; j--) {
            if (board[i][j].gameObject === ALIEN1) {
                if (j + 1 === 14) console.log('BUG!');
                addAlien(board, i, j + 1, ALIEN1);
            } else if (board[i][j].gameObject === ALIEN2) {
                addAlien(board, i, j + 1, ALIEN2);
            } else if (board[i][j].gameObject === ALIEN3) {
                addAlien(board, i, j + 1, ALIEN3);
            }
            board[i][j].gameObject = '';
        }
    }
    renderBoard(board);
}

function shiftBoardLeft(board, fromI, toI) {
    for (var i = fromI; i < toI; i++) {
        for (var j = 0; j <= board[i].length - 1; j++) {
            if (board[i][j].gameObject === ALIEN1) {
                if (j === 0) console.log('BUG!');
                addAlien(board, i, j - 1, ALIEN1);
            } else if (board[i][j].gameObject === ALIEN2) {
                addAlien(board, i, j - 1, ALIEN2);
            } else if (board[i][j].gameObject === ALIEN3) {
                addAlien(board, i, j - 1, ALIEN3);
            }
            board[i][j].gameObject = '';
        }
    }
    renderBoard(board);
}

function shiftBoardDown(board, fromI, toI) {
    for (var i = fromI; i >= toI; i--) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].gameObject === ALIEN1) {
                addAlien(board, i + 1, j, ALIEN1);
            } else if (board[i][j].gameObject === ALIEN2) {
                addAlien(board, i + 1, j, ALIEN2);
            } else if (board[i][j].gameObject === ALIEN3) {
                addAlien(board, i + 1, j, ALIEN3);
            }
            board[i][j].gameObject = '';
        }
    }
    renderBoard(board);
}

function moveAliens() {
    if (gAliensBottomRowIdx === 13) {
        endGame('GAME OVER 😕');
        return;
    }
    if (gIsRight) shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
    else if (!gIsRight) shiftBoardLeft(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
    if (gBoard[gAliensTopRowIdx][gBoard.length - 1].gameObject === ALIEN1 ||
        gBoard[gAliensTopRowIdx][gBoard.length - 1].gameObject === ALIEN2 ||
        gBoard[gAliensTopRowIdx][gBoard.length - 1].gameObject === ALIEN3) {
        setTimeout(() => {
            shiftBoardDown(gBoard, gAliensBottomRowIdx, gAliensTopRowIdx);
            gAliensTopRowIdx += 1;
            gAliensBottomRowIdx += 1;
            gIsRight = !gIsRight;
        }, ALIEN_SPEED)
    }
    if (gBoard[gAliensTopRowIdx][0].gameObject === ALIEN1 ||
        gBoard[gAliensTopRowIdx][0].gameObject === ALIEN2 ||
        gBoard[gAliensTopRowIdx][0].gameObject === ALIEN3) {
        setTimeout(() => {
            shiftBoardDown(gBoard, gAliensBottomRowIdx, gAliensTopRowIdx);
            gAliensTopRowIdx += 1;
            gAliensBottomRowIdx += 1;
            gIsRight = !gIsRight;
        }, ALIEN_SPEED)
    }
}