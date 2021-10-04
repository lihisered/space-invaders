'use strict';
console.log('ALIEN');

const ALIEN_SPEED = 500;
var gIntervalAliens;
// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row
var gAliensTopRowIdx;
var gAliensBottomRowIdx;
var gIsAlienFreeze = true;

function createAliens(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            // currCell = x[i][j];
            if (i < ALIENS_ROW_COUNT && j < ALIENS_ROW_LENGTH) currCell.gameObject = ALIEN;
        }
    }
}

function handleAlienHit(pos) {
    gScore += 10;
    gElScore.innerText = gScore;

    gGame.aliensCount--;
    // console.log(gGame.aliensCount);
    gElAliensCount.innerText = gGame.aliensCount;

    updateCell({ i: pos.i - 1, j: pos.j }, '');
    updateCell(pos, '');

    clearInterval(gLaserInterval);
    gHero.isShoot = false;

    checkGameOver();
}

function shiftBoardRight(board, fromI, toI) {
    for (var i = fromI; i < toI; i++) {
        for (var j = board.length - 1; j >= 0; j--) {

            var edge = getElCell({ i, j: board.length - 1 });

            var nextCell = getElCell({ i, j });
            if (nextCell.innerHTML === ALIEN) {
                if (nextCell === edge) {
                    shiftBoardDown(board, fromI, toI);
                    return;
                }
                updateCell({ i, j }, '');
                updateCell({ i, j: j + 1 }, ALIEN);
            }
        }
    }
    console.table(gBoard);
}

function shiftBoardLeft(board, fromI, toI) {

}

function shiftBoardDown(board, fromI, toI) {
    fromI++;
    // = gAliensTopRowIdx++;
    toI++;
    console.log(fromI, toI);
    //  = gAliensBottomRowIdx = ALIENS_ROW_COUNT++;
    for (var i = gAliensTopRowIdx; i < gAliensBottomRowIdx; i++) {
        for (var j = 0; j < board.length - 1; j++) {}
    }
}

// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
function moveAliens() {
    gAliensTopRowIdx = 0;
    gAliensBottomRowIdx = ALIENS_ROW_COUNT;
    gIntervalAliens = setInterval(function() {
        shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
        renderBoard(gBoard);
    }, 1000)
}