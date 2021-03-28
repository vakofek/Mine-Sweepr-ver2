'use strict'
const MINE = '💣';
const FLAG = '🚩';
const EMPTY = '';
const LIFE = '💓';
const NORMAL_MODE = '😀';
const SAD_MODE = '😢';
const WIN_MODE = '😎';
const HINT = '💡';

var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gGame;
var gBoard;
var gHintCells;
var gMoves;
var gPlayers = [];
var gPlayer;



function init() {
    reset();
    resetTimer();
    updateLife();
    updateHint();
    updateSafeClick();
    updateFlagNum();
    createBoard();
    renderScoresTable(getLevel());
}

function reset() {
    gGame = {
        isOn: false,
        gameOver: false,
        isHintMode: false,
        shownCount: 0,
        markedCount: 0,
        secPassed: 0,
        life: 3,
        hint: 3,
        safeConunt: 3,
        flagNum: gLevel.MINES,
        hitMine: 0,
        moveNum: 0
    };
    gPlayer = {
        name: '',
        gameTime: 0,
        level: getLevel()
    };
    gMoves = [];
    updateSmileyMode('Normal');
    // stopClick('');
}

function createBoard() {
    var board = [];
    var strHTML = '';
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        strHTML += '<tr>'
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                cellType: EMPTY,
                isSafe: false
            };
            var cellType = board[i][j].cellType;
            strHTML += `<td data-i=${i} data-j=${j} oncontextmenu="cellMarked(this,${i},${j})" onclick="cellClicked(this,${i},${j})">${cellType}</td>`;
        }
        strHTML += '</tr>'
    }
    gBoard = board;
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
    console.table(board);
}

function renderBoard() {
    var strHTML = '';
    var cellType;
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isShown) cellType = gBoard[i][j].cellType;
            else cellType = EMPTY;
            strHTML += `<td data-i=${i} data-j=${j} oncontextmenu="cellMarked(this,${i},${j})" onclick="cellClicked(this,${i},${j})">${cellType}</td>`;
        }
        strHTML += '</tr>'
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}


function setLevel(elBtn, minesNum) {
    // debugger;
    gLevel.SIZE = elBtn.value
    gLevel.MINES = minesNum;
    init();
}

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) {
        renderTimer();
        gGame.isOn = true;
        setMines(i, j);
    }
    if (gGame.gameOver) {
        elCell.onclick = false;
        return;
    }
    if (gBoard[i][j].isShown) return;
    gBoard[i][j].isShown = true;
    setMinesNegsCount(i, j);
    if (gGame.isHintMode) {
        showHintNegs(i, j);
        gGame.isHintMode = false;
    }
    if (gBoard[i][j].cellType === 0) {
        expandShown(i, j);
    }
    if (gBoard[i][j].isMine) {
        gGame.life--;
        elCell.style.backgroundColor = 'red';
        gGame.hitMine++;
        gGame.flagNum--;
        updateFlagNum();
        updateLife();
        checkGameOver();
    }
    gGame.shownCount++;
    // gMoves.push({
    //     mode: 'click',
    //     cellElement: elCell
    // });
    renderBoard();
    checkGameOver();
    // console.log('gMoves', gMoves);
}

function cellMarked(elCell, i, j) {
    event.preventDefault();
    if (!gGame.isOn) {
        renderTimer();
        gGame.isOn = true;
        setMines(i, j);
    }
    if (gGame.gameOver) {
        elCell.onclick = false;
        return;
    }
    if (gBoard[i][j].cellType === FLAG) {
        if (gBoard[i][j].isMine) gBoard[i][j].cellType = MINE;
        else setMinesNegsCount(i, j);
        gBoard[i][j].isShown = false;
        if (gBoard[i][j].isMine) {
            gGame.markedCount--;
        }
        gGame.flagNum++;
    }
    else {
        gBoard[i][j].isShown = true;
        gBoard[i][j].cellType = FLAG
        if (gBoard[i][j].isMine) {
            gGame.markedCount++;
        }
        gGame.flagNum--;
    }
    updateFlagNum();
    renderBoard();
    checkGameOver();
}

function updateFlagNum() {
    document.querySelector('.flags').innerHTML = 'Flags: ' + gGame.flagNum;
}

function setMines(i, j) {
    var idx = getRandomInt(0, gBoard.length - 1)
    var jdx = getRandomInt(0, gBoard.length - 1)
    var currCell = gBoard[idx][jdx];
    for (var mines = 0; mines < gLevel.MINES; mines++) {
        while ((!gBoard[idx][jdx].isMine && (idx === i && jdx === i)) || (gBoard[idx][jdx].isMine && !(idx === i && jdx === i))) {
            // while (gBoard[idx][jdx].isMine) {
            idx = getRandomInt(0, gBoard.length - 1)
            jdx = getRandomInt(0, gBoard.length - 1)
        }
        gBoard[idx][jdx].isMine = true;
        gBoard[idx][jdx].cellType = MINE;
        console.log(idx, jdx, gBoard[idx][jdx].isMine);
    }
}

function setMinesNegsCount(idx, jdx) {
    var mineCount = 0;
    if (gBoard[idx][jdx].isMine) return;
    for (var i = idx - 1; i <= idx + 1 && i < gBoard.length; i++) {
        if (i < 0) continue;
        for (var j = jdx - 1; j <= jdx + 1 && j < gBoard.length; j++) {
            if (j < 0) continue;
            if (gBoard[i][j].isMine) mineCount++;
        }
    }
    gBoard[idx][jdx].cellType = mineCount;
}

function expandShown(idx, jdx) {
    for (var i = idx - 1; i <= idx + 1 && i < gBoard.length; i++) {
        if (i < 0) continue;
        for (var j = jdx - 1; j <= jdx + 1 && j < gBoard.length; j++) {
            if (j < 0) continue;
            if (gBoard[i][j].isMine) continue;
            setMinesNegsCount(i, j);
            if (gBoard[i][j].isShown) continue;
            gBoard[i][j].isShown = true;
            gGame.shownCount++;
        }
    }
}

function checkGameOver() {
    // debugger;
    if (gGame.life === 0 || gGame.hitMine === gLevel.MINES) {
        // alert('GAME OVER! - YOU LOSE');
        gGame.gameOver = true;
        // stopClick();
        updateSmileyMode('Lose');
        resetTimer();
    }
    else if ((gGame.shownCount + gGame.markedCount) === (gLevel.SIZE ** 2)) {
        // alert('GAME OVER! - YOU WIN');
        updateSmileyMode('Win');
        gGame.gameOver = true;
        gPlayer.gameTime = gGame.secPassed;
        gPlayers.push(gPlayer);
        console.log('userName ', gPlayer.name, 'win the game after', gPlayer.gameTime, 'sec');
        console.log('players', gPlayers);
        // stopClick();
        renderScoresTable(getLevel());
        resetTimer();
    }
}

function updateLife() {
    var strHTML = '';
    for (var i = 0; i < gGame.life; i++) {
        strHTML += LIFE;
    }
    document.querySelector('.life').innerHTML = strHTML;
}

function updateHint() {
    var strHTML = '';
    for (var i = 0; i < gGame.hint; i++) {
        strHTML += HINT;
    }
    document.querySelector('.hint').innerHTML = strHTML
}

function getHint() {
    gGame.hint--;
    gGame.isHintMode = true;
    updateHint();
}

function showHintNegs(idx, jdx) {
    var hintCells = [];
    console.log('hint mode show : ');
    for (var i = idx - 1; i <= idx + 1 && i < gBoard.length; i++) {
        if (i < 0) continue;
        for (var j = jdx - 1; j <= jdx + 1 && j < gBoard.length; j++) {
            if (j < 0) continue;
            if (i === idx && j === jdx) continue;
            if (gBoard[i][j].isShown) continue;
            setMinesNegsCount(i, j);
            gBoard[i][j].isShown = true;
            hintCells.push(gBoard[i][j]);
        }
    }
    renderBoard();
    setTimeout(function () { StopShowHintNegs(hintCells); }, 1000);
    gHintCells = [];
}

function StopShowHintNegs(hintCells) {
    // debugger;
    var cell;
    for (var i = 0; i < hintCells.length; i++) {
        cell = hintCells[i];
        cell.isShown = false;
    }
    renderBoard();
}

function safeClick() {
    // debugger;
    if (gGame.safeConunt <= 0) return;
    var idx = getRandomInt(0, gLevel.SIZE - 1);
    var jdx = getRandomInt(0, gLevel.SIZE - 1);
    while ((!gBoard[idx][jdx].isMine && gBoard[idx][jdx].isShown) || (gBoard[idx][jdx].isMine && !gBoard[idx][jdx].isShown)) {
        idx = getRandomInt(0, gLevel.SIZE - 1);
        jdx = getRandomInt(0, gLevel.SIZE - 1);
    }
    drawSafeCell(idx, jdx, 'white');
    setTimeout(function () { drawSafeCell(idx, jdx, ''); }, 2000);
    gGame.safeConunt--;
    updateSafeClick();
}
function updateSafeClick() {
    document.querySelector('.safe-click-msg').innerHTML = `${gGame.safeConunt} more left`;
}

function drawSafeCell(idx, jdx, color) {
    document.querySelector(`[data-i="${idx}"][data-j="${jdx}"]`).style.backgroundColor = color;
}

function updateSmileyMode(mode) {
    switch (mode) {
        case 'Normal':
            document.querySelector('.smiley-mode').innerHTML = NORMAL_MODE;
            break;
        case 'Lose':
            document.querySelector('.smiley-mode').innerHTML = SAD_MODE;
            break;
        case 'Win':
            document.querySelector('.smiley-mode').innerHTML = WIN_MODE;
            break;

        default:
            break;
    }
}

function setUserName() {
    gPlayer.name = document.querySelector('.user-name').value;
}

function renderScoresTable(level) {
    gPlayers.sort();
    var strHTML = '<tr><td>Player name</td><td>Game time (sec)</td></tr>';
    for (var i = 0; i < gPlayers.length; i++) {
        if (gPlayers[i].level === level) {
            strHTML += `<tr><td>${gPlayers[i].name}</td>`;
            strHTML += `<td>${gPlayers[i].gameTime}</td></tr>`;
        }
    }
    var elCell = document.querySelector('.scores');
    elCell.innerHTML = strHTML;
}

function getLevel() {
    switch (gLevel.SIZE) {
        case 4:
            return 'Begginer';
            break;
        case '4':
            return 'Begginer';
            break;
        case '8':
            return 'Medium';
            break;
        case '12':
            return 'Expert';
            break;
    }
}
