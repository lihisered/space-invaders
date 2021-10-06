'use strict'

const ALIEN_SPEED = 500;
var gIntervalAliens;
var gAliensTopRowIdx = 0;
var gAliensBottomRowIdx = 2;
var gIsAlienFreeze = true;

function createAliens(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            if (i < ALIENS_ROW_COUNT && j < ALIENS_ROW_LENGTH) {
                currCell.gameObject = ALIEN;

            }
        }
    }
}

function handleAlienHit(pos) {
    gGame.aliensCount++;
    gGame.score += 10;
    var elH1Span = document.querySelector('h1 span');
    elH1Span.innerText = gGame.score;
    if (gGame.aliensCount === ALIENS_ROW_COUNT * ALIENS_ROW_LENGTH) {
        gameOver('YOU MADE IT 😎')
    }
}

function shiftBoardRight(board, fromI, toI) {
    for (var i = fromI; i <= toI; i++) {
        for (var j = board.length - 1; j >= 0; j--) {
            var targetCell = getElCell({ i: i, j: j });
            if (targetCell.innerText === ALIEN) {
                if (j === board.length - 1) {
                    clearInterval(gIntervalAliens);
                    shiftBoardDown(gBoard, gAliensTopRowIdx++, gAliensBottomRowIdx++)
                    gIntervalAliens = setInterval(function() {
                        shiftBoardLeft(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
                    }, ALIEN_SPEED)
                    return
                }
                updateCell({ i: i, j: j }, '');
                updateCell({ i: i, j: j + 1 }, ALIEN);
            }
        }
    }
}

function shiftBoardLeft(board, fromI, toI) {
    for (var i = fromI; i <= toI; i++) {
        for (var j = 0; j <= board.length - 1; j++) {
            var cell = getElCell({ i: i, j: j });
            if (cell.innerText === ALIEN) {
                if (j === 0) {
                    clearInterval(gIntervalAliens);
                    shiftBoardDown(gBoard, gAliensTopRowIdx++, gAliensBottomRowIdx++);
                    gIntervalAliens = setInterval(function() {
                        shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
                    }, ALIEN_SPEED)
                    return
                }
                updateCell({ i: i, j: j }, '');
                updateCell({ i: i, j: j - 1 }, ALIEN);
            }
        }
    }
}


function shiftBoardDown(board, fromI, toI) {
    for (var i = fromI; i <= toI; i++) {
        for (var j = board.length - 1; j >= 0; j--) {
            if (toI === board.length - 3) {
                gameOver('OH SHIT 😥')
            }
            var targetCell = getElCell({ i: i, j: j });
            if (targetCell.innerText === ALIEN) {
                updateCell({ i: fromI, j: j }, '');
                updateCell({ i: toI + 1, j: j }, ALIEN)
            }
        }
    }
}

function moveAliens() {

    if (!gGame.isOn) return;

    gIntervalAliens = setInterval(function() {
        shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
    }, ALIEN_SPEED)


}