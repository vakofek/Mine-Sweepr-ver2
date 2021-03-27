'use strict'

var gTimeInterval;
var gSeconds = 0;
var gMinute = 0;


function renderTimer() {
    gTimeInterval = setInterval(countTimer, 1000);
}

function countTimer() {
    gGame.secPassed++;
    var strTime = '';
    gSeconds++;
    if (gSeconds === 60) {
        gMinute++;
        gSeconds = 0;
    }
    if (gSeconds < 10 && gMinute < 10) strTime = 'Time: 0' + gMinute + ':0' + gSeconds;
    else if (gSeconds < 10) strTime = 'Time: ' + gMinute + ':0' + gSeconds;
    else if (gMinute < 10) strTime = 'Time: 0' + gMinute + ':' + gSeconds;
    var elTimeBox = document.querySelector('.timer');
    elTimeBox.innerHTML = strTime;
}

function resetTimer() {
    document.querySelector('.timer').innerHTML = 'Time: 00:00';;
    clearInterval(gTimeInterval);
    gSeconds = 0;
    gMinute = 0;
}
