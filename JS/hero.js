'use strict'

const LASER_SPEED = 80;
const FAST_LASER_SPEED = 20;
var gLaserInterval;
var gBlowNegs = false
var isFastLaser = false;
var gFastLaserCount = 0;
var gHero = { pos: { i: 12, j: 7 }, isShoot: false };

function createHero(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[gHero.pos.i][gHero.pos.j].gameObject = HERO;
        }
    }
}

function onKeyDown(event) {
    if (gGame.isOn) {

        var i = gHero.pos.i
        var j = gHero.pos.j

        switch (event.key) {
            case 'ArrowLeft':
                moveHero({ i: i, j: j - 1 });
                break;
            case 'ArrowRight':
                moveHero({ i: i, j: j + 1 });
                break;
            case ' ':
                if (gHero.isShoot) return
                shoot({ i: i - 1, j: j })
                break;
            case 'n':
                gBlowNegs = true;
                break;
            case 'x':
                if (gFastLaserCount === 3) return
                if (gHero.isShoot) return
                isFastLaser = true;
                shoot({ i: i - 1, j: j })
                break;
        }
    }
}

function moveHero(pos) {

    if (pos.j < 0 || pos.j > gBoard.length - 1) return
    var i = pos.i;
    var j = pos.j
    updateCell(gHero.pos, '');
    gHero.pos.i = i;
    gHero.pos.j = j;
    updateCell(pos, HERO);

}

function shoot(pos) {
    if (!gGame.isOn) return;
    if (isFastLaser) {
        gFastLaserCount++
        console.log(gFastLaserCount);
        updateCell(pos, FAST_LASER);
        gLaserInterval = setInterval(function() {
            blinkLaser(pos);
        }, FAST_LASER_SPEED)
    } else {
        updateCell(pos, LASER);
        gLaserInterval = setInterval(function() {
            blinkLaser(pos);
        }, LASER_SPEED)
    }
}

function blinkLaser(pos) {
    gHero.isShoot = true;

    if (pos.i === 0) {
        clearInterval(gLaserInterval)
        updateCell(pos, '');
        gHero.isShoot = false
        return;
    }
    var targetCell = getElCell({ i: pos.i - 1, j: pos.j });
    if (targetCell.innerText === ALIEN) {
        if (gBlowNegs) {
            blowNegs(pos);
            handleAlienHit(pos)
            gBlowNegs = false
        }
        updateCell(pos, '')
        updateCell({ i: pos.i - 1, j: pos.j }, '');
        targetCell.innerText = '';
        gHero.isShoot = false
        clearInterval(gLaserInterval)
        handleAlienHit(pos)
        isFastLaser = false
        return;
    }
    if (targetCell.innerText === SPACE_CANDY) {
        gGame.score += 50;
        var elH1Span = document.querySelector('h1 span');
        elH1Span.innerText = gGame.score;
    }

    updateCell(pos, '');
    pos.i--;
    updateCell(pos, isFastLaser ? FAST_LASER : LASER);
}