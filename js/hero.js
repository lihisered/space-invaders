'use strict';
console.log('HERO');

var gLaserInterval;
const LASER_SPEED = 80;
var gHero = { pos: { i: 12, j: 5 }, isShoot: false };

// creates the hero and place it on board
function createHero(board) {
    board[gHero.pos.i][gHero.pos.j].gameObject = HERO;
}

// Handle game keys
function onKeyDown(ev) {
    // console.log(ev);
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
        }
    }
}

// Move the hero right (1) or left (-1)
function moveHero(dir) {
    var i = dir.i;
    var j = dir.j;
    // console.log(dir);
    if (j < 0 || j > gBoard.length - 1) return;
    // console.log(targetCell);

    updateCell({ i: gHero.pos.i, j: gHero.pos.j }, '');
    gHero.pos.i = i;
    gHero.pos.j = j;
    updateCell(dir, HERO);
}

// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot(pos) {
    updateCell(pos, LASER);
    gLaserInterval = setInterval(function() {
        blinkLaser(pos);
    }, 20)
}

// renders a LASER at specific cell for short time and removes it
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
        elCell.innerHTML = '';
        handleAlienHit(pos);
        return;
    }

    updateCell(pos, '');
    pos.i--;
    updateCell(pos, LASER);
}