'use strict'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}







// function createBoard() {
//     var board = [];
//     for (var i = 0; i < gLevel.SIZE; i++) {
//         board[i] = [];
//         for (var j = 0; j < gLevel.SIZE; j++) {
//             board[i][j] = {
//                 minesAroundCount: 0,
//                 isShown: false,
//                 isMine: false,
//                 isMarked: false,
//                 cellType: EMPTY
//             };
//         }
//     }
//     console.table(board);
//     gBoard = board;
//     renderBoard();
// }



// function renderBoard() {
//     var strHTML = '';
//     for (var i = 0; i < gBoard.length; i++) {
//         strHTML += '<tr>'
//         for (var j = 0; j < gBoard.length; j++) {
//             var cellType = gBoard[i][j].cellType;
//             strHTML += `<td data-i=${i} data-j=${j} onclick="cellMarked(this,${i},${j})">${cellType}</td>`;
//         }
//         strHTML += '</tr>'
//     }
//     var elBoard = document.querySelector('.board');
//     elBoard.innerHTML = strHTML;
// }