'use strict';
console.log('Space Invaders');

const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8;
const ALIENS_ROW_COUNT = 3;
const HERO = '🐻';
const ALIEN = '🐒';
const LASER = '🔥';
const SKY = 'SKY';
const EARTH = 'EARTH';

var gElScore = document.querySelector('h2 span');
var gElAliensCount = document.querySelector('h3 span');

// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN}
var gBoard;
var gScore;
var gGame = {
    isOn: false,
    aliensCount: 0
}

// Called when game loads
function init() {
    gBoard = createBoard();
    renderBoard(gBoard);

    gScore = 0;
    gElScore.innerText = 0;
    gGame.aliensCount = ALIENS_ROW_COUNT * ALIENS_ROW_LENGTH;
    gElAliensCount.innerText = gGame.aliensCount;
}

function startGame() {
    gGame.isOn = true;
    document.querySelector('.restart-btn').innerText = 'Start';
    document.querySelector('.score-container').hidden = false;
    document.querySelector('.win-container').hidden = true;
    moveAliens();
}

// Create and returns the board with aliens on top, ground at bottom
// use the functions: createCell, createHero, createAliens
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

// Render the board as a <table> to the page
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

// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(type, gameObject = '') {
    return {
        type,
        gameObject
    }
}

// position such as: {i: 2, j: 7}
function updateCell(pos, gameObject = null) {
    // console.log(pos);
    gBoard[pos.i][pos.j].gameObject = gameObject;
    var elCell = getElCell(pos);
    elCell.innerHTML = gameObject || '';
}

function checkGameOver() {
    // console.log(gGame.aliensCount);
    if (!gGame.aliensCount) {
        gGame.isOn = false;
        document.querySelector('.score-container').hidden = true;
        document.querySelector('.win-container').hidden = false;
        document.querySelector('.restart-btn').innerText = 'Restart';
    }
}