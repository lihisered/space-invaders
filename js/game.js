'use strict';
console.log('Space Invaders');

const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8;
const ALIENS_ROW_COUNT = 3;
const HERO = '🛸';
const ALIEN1 = '🦍';
const ALIEN2 = '🐘';
const ALIEN3 = '🦕';
const LASER = '🧪';
const SUPER_LASER = '💧';
const SPACE_CANDY = '🍇';
const SKY = 'SKY';
const EARTH = 'EARTH';

var gElScore = document.querySelector('h3 span');
var gCandyInterval;
var gBoard;
var gScore;
var gGame = {
    isOn: false,
    aliensCount: 0
}

function init() {
    gGame.isOn = false;
    gIsRight = true;

    gAliensTopRowIdx = 0;
    gAliensBottomRowIdx = ALIENS_ROW_COUNT;

    gBoard = createBoard();
    renderBoard(gBoard);

    gScore = 0;
    gElScore.innerText = 0;
    gGame.aliensCount = ALIENS_ROW_COUNT * ALIENS_ROW_LENGTH;

    document.querySelector('.game-over').style.display = 'none';
}

function start() {
    if (gGame.isOn) return;
    clearInterval(gIntervalAliens);
    clearInterval(gCandyInterval)
    gGame.isOn = true;

    gCandyInterval = setInterval(() => {
        addSpaceCandy();
    }, 8000)

    gIntervalAliens = setInterval(() => {
        moveAliens();
    }, ALIEN_SPEED);
}

function restart() {
    if (gGame.isOn) return;
    // start();
    // init();
    window.location.reload();
}

function createBoard() {
    var board = [];
    for (var i = 0; i < BOARD_SIZE; i++) {
        var row = [];
        for (var j = 0; j < BOARD_SIZE; j++) {
            var currCell = createCell(SKY);
            if (i === 13) currCell.type = EARTH;
            row.push(currCell);
        }
        board.push(row);
    }
    createHero(board);
    createAliens(board);
    return board;
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            var className = (currCell.type === SKY) ? 'sky' : 'earth';
            var tdId = `cell-${i}-${j}`;

            strHTML += `<td id="${tdId}" class="${className}" data-i="${i}" data-j="${j}">${currCell.gameObject}</td>`;
        }
        strHTML += '</tr>';
    }
    var elMat = document.querySelector('.board-container');
    elMat.innerHTML = strHTML;
}

function createCell(type, gameObject = '') {
    return {
        type,
        gameObject
    }
}

function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject;
    var elCell = getElCell(pos);
    elCell.innerHTML = gameObject || '';
}

function checkIsVictory() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].gameObject === ALIEN1 ||
                gBoard[i][j].gameObject === ALIEN2 ||
                gBoard[i][j].gameObject === ALIEN3) return;
        }
    }
    endGame('VICTORY! 🏆');
}

function endGame(txt) {
    console.log(txt);
    document.querySelector('.game-over').style.display = 'block';
    document.querySelector('.game-over').innerText = txt;
    clearInterval(gIntervalAliens);
    clearInterval(gCandyInterval);
    gCandyInterval = null;
    gGame.isOn = false;
}

function addSpaceCandy() {
    var emptyCell = getEmptyCell();
    if (!emptyCell) return;
    updateCell({ i: emptyCell.i, j: emptyCell.j }, SPACE_CANDY);

    setTimeout(() => {
        if (gBoard[emptyCell.i][emptyCell.j].gameObject === SPACE_CANDY)
            updateCell({ i: emptyCell.i, j: emptyCell.j }, '')
    }, 5000);
}

function getEmptyCell() {
    var emptyCells = getEmptyCells();
    if (emptyCells.length === 0 || !emptyCells) return;
    var randIdx = getRandomInt(0, emptyCells.length);
    var emptyCell = emptyCells[randIdx];
    return emptyCell;
}

function getEmptyCells() {
    var emptyCells = [];
    for (var i = 0; i < 1; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j];
            if (currCell.gameObject === '') {
                emptyCells.push({ i, j });
            }
        }
    }
    return emptyCells;
}