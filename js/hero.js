'use strict';
console.log('HERO');

var gLaserInterval;
const LASER_SPEED = 30;
const SUPER_LASER_SPEED = 10;
var gSuperModeCount = 3;
var gHero = { pos: { i: 12, j: 5 }, isShoot: false };
var gIsNegs = false;
var gIsSuper = false;

function createHero(board) {
    board[gHero.pos.i][gHero.pos.j].gameObject = HERO;
}

function onKeyDown(ev) {
    var i = gHero.pos.i;
    var j = gHero.pos.j;
    var dir = null;
    if (gGame.isOn) {
        switch (ev.key) {
            case 'ArrowLeft':
                dir = { i, j: j - 1 };
                moveHero(dir);
                break;
            case 'ArrowRight':
                dir = { i, j: j + 1 };
                moveHero(dir);
                break;
            case ' ':
                if (gHero.isShoot) return;
                dir = { i: i - 1, j };
                shoot(dir);
                break;
            case 'n':
                gIsNegs = true;
                break;
            case 'x':
                if (gSuperModeCount === 0) return;
                if (gHero.isShoot) return;
                gIsSuper = true;
                dir = { i: i - 1, j };
                shoot(dir);
                break;
        }
    }
}

function moveHero(dir) {
    var i = dir.i;
    var j = dir.j;
    if (j < 0 || j > gBoard.length - 1) return;

    updateCell({ i: gHero.pos.i, j: gHero.pos.j }, '');
    gHero.pos.i = i;
    gHero.pos.j = j;
    updateCell(dir, HERO);
}

function shoot(pos) {
    if (gIsSuper) {
        gSuperModeCount--;
    }
    var speed = gIsSuper ? SUPER_LASER_SPEED : LASER_SPEED;
    updateCell(pos, gIsSuper ? SUPER_LASER : LASER);
    gLaserInterval = setInterval(() => {
        blinkLaser(pos);
    }, speed)
}

function blinkLaser(pos) {
    gHero.isShoot = true;

    if (pos.i === 0) {
        clearInterval(gLaserInterval);
        updateCell(pos, '');
        gHero.isShoot = false;
        return;
    }

    var elCell = getElCell({ i: pos.i - 1, j: pos.j });

    if (elCell.innerHTML === ALIEN) {
        if (gIsNegs) {
            blowNegs(pos);
            gIsNegs = false;
            gScore -= 10;
            gGame.aliensCount++;

        }
        gIsSuper = false;
        elCell.innerHTML = '';
        handleAlienHit(pos);
        return;
    }

    if (elCell.innerHTML === SPACE_CANDY) {
        gScore += 50;
        gElScore.innerText = gScore;
        clearInterval(gIntervalAliens);
        setTimeout(() => {
            setInterval(() => {
                moveAliens();
            }, ALIEN_SPEED);
        }, 5000)
    }

    updateCell(pos, '');
    pos.i--;
    updateCell(pos, gIsSuper ? SUPER_LASER : LASER);
}

function blowNegs(pos) {
    var cellI = pos.i;
    var cellJ = pos.j;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (gBoard[i][j].gameObject === ALIEN) {
                updateCell({ i, j }, '');
                gScore += 10;
                gGame.aliensCount--;
            }
        }
    }
}