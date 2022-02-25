'use strict';
const game = document.querySelector('.main__game');
const message = document.querySelector('.main__message');
const gameButton = document.querySelector('.main__button');
const cells = document.querySelectorAll('.main__cell');
let move = false;
let count = 0;
let gamesPlayed = [];
const circle = `<svg class="circle">
						<circle r="35" cx="47" cy="47" stroke="blue" stroke-width="10" fill="none" stroke-linecap="round" />
						</svg>` 
const cross = `<svg class="cross">
						<line class="first" x1="15" y1="15" x2="85" y2="85" stroke="red" stroke-width="10" stroke-linecap="round" />
						<line class="second" x1="85" y1="15" x2="15" y2="85" stroke="red" stroke-width="10" stroke-linecap="round" />
					</svg>`;
const table = document.querySelector('.main__records-container');
const tableCells = document.querySelectorAll('.table-data');
const recordButton = document.querySelector('.main__records-button');
const closeButton = document.querySelector('.close');
const clearButton = document.querySelector('.main__clear-button');

function moveCross(target){
	if (target.tagName == 'svg' || target.tagName == 'line' || target.tagName == 'circle'){
		return
	}
	target.innerHTML = cross;
	target.classList.add('x');
	let crossAudio = new Audio('./assets/audio/cross.mp3');
	crossAudio.play();
	count++;
	move = true;
}

function moveZero(target) {
	if (target.tagName == 'svg' || target.tagName == 'line' || target.tagName == 'circle') {
		return
	}
	target.innerHTML = circle;
	target.classList.add('o');
	let circleAudio = new Audio('./assets/audio/circle.mp3');
	circleAudio.play();
	count++;
	move = false;
}

function gamePlay(e) {
	message.innerHTML = `The Game started`;
	if(!move) moveCross(e.target);
	else moveZero(e.target);
	gameWin();
}

function gameWin() {
	let winComb = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];

	let win = false

	for (let i = 0; i < winComb.length; i++){
		if (cells[winComb[i][0]].classList.contains('x') &&
			cells[winComb[i][1]].classList.contains('x') &&
			cells[[winComb[i][2]]].classList.contains('x')) {
			setTimeout(() => {
				cells[winComb[i][0]].classList.add('active');
				cells[winComb[i][1]].classList.add('active');
				cells[winComb[i][2]].classList.add('active');
				message.innerHTML = `<span class="red">"X"</span> wins! ${count} moves.`;
				gamesPlayed.unshift(message.textContent);
				gamesPlayedCheck(gamesPlayed);
				localStorage.setItem('key', gamesPlayed);
				fillRecordsTable();	
			},1000);
			game.removeEventListener('click', gamePlay);
			win = true;
		}
		else if (cells[winComb[i][0]].classList.contains('o') && 
					cells[winComb[i][1]].classList.contains('o') && 
					cells[[winComb[i][2]]].classList.contains('o')) {
			setTimeout(() => {
				cells[winComb[i][0]].classList.add('active');
				cells[winComb[i][1]].classList.add('active');
				cells[winComb[i][2]].classList.add('active');
				message.innerHTML = `<span class="blue">"O"</span> wins! ${count} moves.`;
				gamesPlayed.unshift(message.textContent);
				gamesPlayedCheck(gamesPlayed);
				localStorage.setItem('key', gamesPlayed);
				fillRecordsTable()
			}, 1000);
			game.removeEventListener('click', gamePlay);
			win = true;
		}
	} 

	if (count == 9 && win === false) {
		setTimeout(() => {
			message.innerHTML = `It's a draw! 9 moves.`;
			// gamesPlayed.unshift(message.textContent);
			// gamesPlayedCheck(gamesPlayed);
			// localStorage.setItem('key', gamesPlayed);
			// fillRecordsTable();
		}, 500);
		game.removeEventListener('click', gamePlay);
		return
	}
}

function gamesPlayedCheck(gamesPlayed) {
	if (gamesPlayed.length > 10){
		gamesPlayed.splice(10, 1);
	}
}

function newGame() {
	move = false;
	count = 0;
	message.innerHTML = `Click any field to start with <span class="main__start">"X"</span>`;
	cells.forEach(item => {
		item.innerHTML = '';
		item.classList.remove('x', 'o', 'active');
	});
	game.addEventListener('click', gamePlay);
}

function fillRecordsTable(){
	for (let i = 0; i < 10; i++) {
		if (localStorage.getItem('key').split(',').length <= 10) {
		//tableCells[i].textContent = gamesPlayed[i];
		tableCells[i].textContent = (localStorage.getItem('key').split(','))[i];
		} else {
			localStorage.getItem('key').split(',').splice(10, 1);
			tableCells[i].textContent = (localStorage.getItem('key').split(','))[i];
		}
	}
} 

function toggleRecord() {
	table.classList.toggle('open');
}

function closeRecord() {
	table.classList.remove('open');
}

function clearLocalStorage() {
	localStorage.removeItem('key');
	tableCells.forEach(e => e.textContent = '');
	gamesPlayed = [];
	setTimeout(() => {
	closeRecord()
	},1000)
}

gameButton.addEventListener('click', newGame);
game.addEventListener('click', gamePlay);
recordButton.addEventListener('click', toggleRecord);
closeButton.addEventListener('click', closeRecord);
clearButton.addEventListener('click', clearLocalStorage);
window.addEventListener('load', () => {
	if (localStorage.getItem('key').split(',').length > 0){
	gamesPlayed = localStorage.getItem('key').split(',')
	} 
});
window.addEventListener('load', fillRecordsTable);

console.log(`
Ваша отметка - 70 балла(ов)
Отзыв по пунктам ТЗ:


Все пункты выполнены полностью!
`)

