'use strict'

const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 3
const HERO = '🚠';
const ALIEN = '👽';
const LASER = '⚡';
const FAST_LASER = '🔥'
const SPACE_CANDY = '🧁'
const SKY = 'sky';
const GROUND = 'ground';

var candyInterval
var gBoard;
var gGame = {
    isOn: false,
    aliensCount: 0,
    score: 0
}

function init() {
    gBoard = createBoard();
    renderBoard(gBoard)
    gGame.score = 0;
    gGame.aliensCount = 0;
}

function startGame(elBtn) {
    gGame.isOn = true

    if (elBtn.innerText === 'Restart') {
        elBtn.innerText = 'Start'
    } else {
        moveAliens();
        init();
        elBtn.style.visibility = 'hidden'
        var elH2 = document.querySelector('h2');
        elH2.style.visibility = 'hidden'
        candyInterval = setInterval(function() {
            placeTheCandies(SPACE_CANDY)
        }, 10000)
    }
}

function createBoard() {
    var board = [];
    for (var i = 0; i < BOARD_SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < BOARD_SIZE; j++) {
            var cell = createCell();
            if (i === BOARD_SIZE - 1) cell.type = GROUND;

            board[i][j] = cell;
        }
    }
    createHero(board)
    createAliens(board);
    return board;
}

function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            var cellClass = getClassName({ i: i, j: j })
            currCell.type === SKY ? cellClass += ' sky' : cellClass += ' ground'
            strHTML += `\t<td class="cell ${cellClass}" data-i="${i}" data-j="${j}" >\n`;
            if (currCell.gameObject === HERO) strHTML += HERO;
            if (currCell.gameObject === ALIEN) strHTML += ALIEN;
            if (currCell.gameObject === LASER) strHTML += LASER;
            if (currCell.gameObject === FAST_LASER) strHTML += FAST_LASER;
            if (currCell.gameObject === SPACE_CANDY) strHTML += SPACE_CANDY;
            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}


function gameOver(str) {
    clearInterval(gIntervalAliens)
    clearInterval(candyInterval)
    gGame.isOn = false
    var elH2 = document.querySelector('h2');
    elH2.style.visibility = 'visible'
    elH2.innerText = str;
    var elBtn = document.querySelector('button');
    elBtn.innerText = 'Restart';
    elBtn.style.visibility = 'visible'

}

function placeTheCandies(element) {
    var cell = getEmptyCell();
    if (gBoard[cell.i][cell.j].gameObject) return;
    updateCell({ i: cell.i, j: cell.j }, element);
    setTimeout(function() {
        updateCell({ i: cell.i, j: cell.j }, '')
    }, 5000)
}