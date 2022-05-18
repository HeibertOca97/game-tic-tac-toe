
class Game{
   constructor(){
      this.active = true;
      this.status = ["", "", "", "", "", "", "", "", ""];
      this.statusMessage = null;
      this.cells = ["top-left", "top-center", "top-right", "middle-left", "middle-center", "middle-right", "botton-left", "botton-center", "botton-right"];
      this.winningPlays = [
         [0, 1, 2],
         [3, 4, 5],
         [6, 7, 8],
         [0, 3, 6],
         [1, 4, 7],
         [2, 5, 8],
         [0, 4, 8],
         [2, 4, 6]
      ];
      this.sounds = {
         winner: "./src/winner.wav",
         draw: "./src/action.mp3",
         fund: "./src/funds.wav",
         touches: "./src/touch.wav",
      };      
      this.score = [];
   }

   setActive(active){
      this.active = active;
   }

   setStatus(index, character){
      this.status[index] = character;
   }

   setStatusMessage(message){
      this.statusMessage = message;
   }

   addScoreState(data){
      this.score.push(data);
   }

   getPlayer1Score(){
      return this.score.filter(data => data.character === "X" && data.type === 'winner');
   }
   
   getPlayer2Score(){
      return this.score.filter(data => data.character === "O" && data.type === 'winner');
   }

   getPlayerDraw(){
      return this.score.filter(data => data.type === 'tied');
   }

   clearData(){
      this.active = true;
      this.status= ["", "", "", "", "", "", "", "", ""];
      this.statusMessage = null;
   }

   clearScore(){
      this.score = [];
   }

}

class Player{ 

   constructor(){
      this.currently = "X";
      this.winner = {
         username: null,
         character: null
      };
      this.name = {
         first: "Player1",
         second: "Player2"
      }  
   }

   setWinnerName(username){
      this.winner.username = username;
   }

   setWinnerCharacter(character){
      this.winner.character = character;
   }

   setCurrentCharacter(character){
      this.currently = character;
   }

   setPlayerData(player1, player2) {
      this.name.first = player1;
      this.name.second = player2;
   }

   clearData(){
      this.currently = "X";
      this.winner = {
         username: null,
         character: null
      };
   }
}
   
/**************************
 * 
 * 
 *  GENERAL VARIABLES: HTML ELEMENT - "GAME" AND "PLAYERS" STATE 
 * 
 * 
 ************************/
var boxGame = document.querySelector(".box-game"),
   currentPlayer = document.querySelector("#player-character"),
   audioBox = document.querySelector("#audioBox"),
   btnPlayMusic = document.getElementById("btn-music"),
   btnGameStart = document.getElementById("btn-playnow"),
   homeComponent = document.querySelector(".game_first_display"),
   gameComponent = document.querySelector(".game_second_display");

let iconSound = btnPlayMusic.children[0];
let inputRange = document.querySelector("input[name=vol]"),
   txtVolum = document.getElementById("txt-vol");

let gameClass = new Game();
let playerClass = new Player();


/*******
 * General functions
********/

/**** 
 * @void - this function changes the turn to start 
****/
function changeCurrentFirstTurn(){
   if(!gameClass.status.includes("X") && !gameClass.status.includes("O")){
      playerClass.setCurrentCharacter(playerClass.currently == "X" ? "O" : "X")
      currentPlayer.innerHTML = playerClass.currently;
   }
}

/***
   @void - this function cleans the game state and the DOM
****/
function retryGame() {
   let cellElement = document.querySelectorAll(".control-cell");
   cellElement.forEach(el => {
      el.style.boxShadow = "0px 0px 10px var(--shadow-2)";
      el.innerHTML = "";
   });

   // Reset game state
   resetGameState();
   handleToggleModal();
}

/***
   @void - this function controls the modal of volume
****/
function toggleModalVolume(){
   let modalVolume = document.querySelector(".modal_volume");

   if(modalVolume.classList.contains('show')){
      modalVolume.classList.replace('show', 'hide');
   }else{
      modalVolume.classList.replace('hide', 'show');
   }
}

/***
   @void - this function is to control the screens
****/
function handleChangeGameScreen(display1, display2) {
   homeComponent.style.display = display1;
   gameComponent.style.display = display2;
}
/**************************
 * 
 * 
 * CODE: GAME RULE
 * 
 * 
 ************************/

/***
   @void - this function adds the cells to the board
****/
function addControlCell() {
   gameClass.cells.forEach((el, index) => {
      boxGame.insertAdjacentHTML("beforeend", `<div data="${el}" data-index="${index}" class="item control-cell"></div>`);
   });
}

/***
   @void - this function goes through and validates each one of the cells at the moment of being filled.
****/
function addItemInCellAndGameValidation() {
   let cellElement = document.querySelectorAll(".control-cell");

   cellElement.forEach(currentCell => {
      currentCell.addEventListener("click", () => { 
         if (gameClass.status[currentCell.getAttribute("data-index")] !== "" || !gameClass.active) {
            return;
         }
         drawCurrentPlayer(currentCell);
         checkGame();
         currentPlayer.innerHTML = playerClass.currently;
      });
   });
}

/***
   @void - this function adds the character and style of the cells.
****/
function drawCurrentPlayer(el) {
   // add player symbol
   gameClass.setStatus(el.getAttribute("data-index"), playerClass.currently);
   // insert symbol into cell 
   el.insertAdjacentHTML("afterbegin", `<span class="value ${playerClass.currently == "X" ? "first_color_value" : "second_color_value"
   }">${playerClass.currently}</span>`);
   // cell shadow
   el.style.boxShadow = `0px 0px 10px ${playerClass.currently == "X" ? "var(--first-color-value)" : "var(--second-color-value)"}`;
   // get previous move 
   playerClass.setWinnerName(playerClass.currently == "X" ? playerClass.name.first : playerClass.name.second);
   playerClass.setWinnerCharacter(playerClass.currently == "X" ? "X" : "O");
   // Player turn update
   playerClass.setCurrentCharacter(playerClass.currently == "X" ? "O" : "X");
}

/***
   @void - this function checks who is the winner or tied
****/
function checkGame() {
   let isWinner = false;
   let a, b, c;

   for (let i = 0; i < gameClass.winningPlays.length; i++) {
      a = gameClass.status[gameClass.winningPlays[i][0]];
      b = gameClass.status[gameClass.winningPlays[i][1]];
      c = gameClass.status[gameClass.winningPlays[i][2]];


      if (a === '' || b === '' || c === '') {
         continue;
      }

      if (a === b && b === c) {
         isWinner = true;
         break;
      }
   }

   if (!isWinner && gameClass.status.includes("")) {
      validateSound("touches");
      return;
   }
   // Is winner
   if (isWinner) {
      setTimeout(() => validateSound("winner"), 400);
      gameClass.setActive(false);
      gameClass.statusMessage = `<p><strong class="cl-text">${playerClass.winner.username}</strong> is the winner! "<strong class="cl-text">${playerClass.winner.character}</strong>"</p>`;
      gameClass.addScoreState({
         username: playerClass.winner.username,
         character: playerClass.winner.character,
         type: 'winner'
      });

      setTimeout(() => {
         handleToggleModal("winner");
         addScoreBox({
            player1Counter: gameClass.getPlayer1Score().length,
            player2Counter: gameClass.getPlayer2Score().length,
            playerTieCounter: gameClass.getPlayerDraw().length
         });
      }, 400);
      return;
   }

   // Game over
   if (!gameClass.status.includes("")) {
      setTimeout(() => validateSound("tied"), 400);
      gameClass.setActive(false);
      gameClass.statusMessage = "This game ended in a draw!";
      gameClass.addScoreState({
         type: 'tied'
      })
      setTimeout(() => {
         handleToggleModal("tied");
         addScoreBox({
            player1Counter: gameClass.getPlayer1Score().length,
            player2Counter: gameClass.getPlayer2Score().length,
            playerTieCounter: gameClass.getPlayerDraw().length
         });
      }, 400);
      return;
   }
}

/***
   @void - this function prints the result in the DOM
****/
function addScoreBox(score){
   const {player1Counter, player2Counter, playerTieCounter} = score;
   document.getElementById('player1-score').textContent = player1Counter;
   document.getElementById('player2-score').textContent = player2Counter;
   document.getElementById('player-tie-score').textContent = playerTieCounter;
}

/***
   @void - this function adds effect to cells
****/
function handleEventHoverChangeCurrentFirstTurn(){
   let btnCurrentCharacter = document.getElementById("btn-current-character");
   btnCurrentCharacter.addEventListener('mouseenter', ()=>{
      if(!gameClass.status.includes("X") && !gameClass.status.includes("O")){
         btnCurrentCharacter.style.cursor = "pointer";
      }else{
         btnCurrentCharacter.style.cursor = "not-allowed";
      }
   })
}

/***
   @void - this function adds effect to cells
****/
function handleEventHoverControllCell(){
   let controlCell = document.querySelectorAll('.control-cell');

   for(let i = 0; i < controlCell.length; i++){
      controlCell[i].addEventListener('mouseenter', () => {
         if(controlCell[i].innerHTML == ""){
            controlCell[i].style.cursor = "pointer";
         }else{
            controlCell[i].style.cursor = "not-allowed";
         }
      });
   }

}

/***
   @void - this function exits the game and clears the game state and DOM
****/
function logoutGame() {
   audioBox.autoplay = true;
   audioBox.loop = true;
   if(audioBox.volume > 0) if (iconSound.classList.contains("fa-volume-mute")) iconSound.classList.replace("fa-volume-mute", "fa-volume-down");
   validateSound("fund");

   // Logout game
   handleChangeGameScreen('flex', 'none')
   homeComponent.setAttribute('data-state', "true");
   // Restart game state
   resetGameState();
   handleToggleModal();
   boxGame.innerHTML = '';
   // clear score
   gameClass.score = [];
   addScoreBox({
      player1Counter: gameClass.getPlayer1Score().length,
      player2Counter: gameClass.getPlayer2Score().length,
      playerTieCounter: gameClass.getPlayerDraw().length
   });
}



/***
   @void - this function cleans the game state 
****/
function resetGameState() {
   // HTML Data
   currentPlayer.innerHTML = "X";
   // Player Data
   playerClass.clearData();
   // Game Data
   gameClass.clearData();
}

function gameStart() {
   addControlCell();
   /** Show the starting character **/
   currentPlayer.innerHTML = playerClass.currently;
   addItemInCellAndGameValidation();
   handleEventHoverControllCell();
   handleEventHoverChangeCurrentFirstTurn();
}
/**************************
 * 
 * 
 * CODE: GAME SOUND
 * 
 * 
 ************************/
/***
   @void - this function plays the sound of the game
****/
function validateSound(gameResult = "touches") {
   if (gameResult == "tied") {
      audioBox.setAttribute("src", gameClass.sounds.draw);
   } else if (gameResult == "winner") {
      audioBox.setAttribute("src", gameClass.sounds.winner);
   } else if (gameResult == "fund") {
      audioBox.setAttribute("src", gameClass.sounds.fund);
   } else {
      audioBox.setAttribute("src", gameClass.sounds.touches);
   }
   
   if(audioBox.volume > 0 && Number(inputRange.value) > 0) audioBox.play();
}

/***
   @void - this function controls the sound of the game
****/
inputRange.addEventListener('input', (ev) => {
   let inputValue, result;

   inputValue = Number(ev.target.value);
   txtVolum.innerHTML = inputValue;

   result = getNumberConvertedIntegerToDecimal(inputValue);
   audioBox.volume = result;

   if(inputValue > 0 && inputValue < 11){
      if (iconSound.classList.contains("fa-volume-mute")) iconSound.classList.replace("fa-volume-mute", "fa-volume-down");
   }else{
      if (iconSound.classList.contains("fa-volume-down")) iconSound.classList.replace("fa-volume-down", "fa-volume-mute");
   }
});

/***
   @decimal - this function returns a decimal number.
****/
function getNumberConvertedIntegerToDecimal(integerNumber){
   let number, result;

   number = Number(integerNumber);
   result = number / 10;
   return result;
}

/***
   @integer - this function returns an integer.
****/
function getNumberConvertedDecimalToInteger(decimalNumber){
   let number, result;

   number = Number(decimalNumber);
   result = number * 10;
   return result;
}

/***
   @boolean - this function checks permission for sound playback
****/
async function audioValidationPermision() {
   try {
      const constraints = { audio: true };
      let { active } = await navigator.mediaDevices.getUserMedia(constraints);
      return active;
   } catch (error) {
      console.info("This website is not allowed to play automatic sound.");
      return false;
   }
}

/***
   @void - this function checks the permission for sound playback and returns a boolean value as the result.
****/
async function handleAutoPlaySoundValitation() {
   if(homeComponent.getAttribute("data-state") && homeComponent.getAttribute("data-state") == "true"){
      homeComponent.setAttribute('data-state', "false");
      audioBox.autoplay = true;
      audioBox.loop = true;
   }

   if(await audioValidationPermision()){
      audioBox.play();
      audioBox.volume = 0.1;
      if (iconSound.classList.contains("fa-volume-mute")) iconSound.classList.replace("fa-volume-mute", "fa-volume-down");
   }else{
      audioBox.volume = 0;
      if (iconSound.classList.contains("fa-volume-down")) iconSound.classList.replace("fa-volume-down", "fa-volume-mute");
   }

   let result = getNumberConvertedDecimalToInteger(audioBox.volume);
   inputRange.value = result;
   txtVolum.innerHTML = result;
}

/***
   @void - this function is to control when the sound is silent or normal.
****/
function controlAudioMuteAndPlay() {
   if (audioBox.paused) {
      audioBox.play();
   }

   if (audioBox.volume > 0) {
      audioBox.volume = 0;
      if (iconSound.classList.contains("fa-volume-down")) iconSound.classList.replace("fa-volume-down", "fa-volume-mute");
   } else {
      audioBox.volume = 0.1;
      if (iconSound.classList.contains("fa-volume-mute")) iconSound.classList.replace("fa-volume-mute", "fa-volume-down");
   }

   let result = getNumberConvertedDecimalToInteger(audioBox.volume);
   inputRange.value = result;
   txtVolum.innerHTML = result;
}

/***
   @void - this function changes the state of the modal (show and hide).
****/
function handleToggleModal(type) {
   let modalGame = document.querySelector(".modal_game_control"),
      component = document.querySelectorAll(".component");

   if (!modalGame.getAttribute("data-state")) {
      modalGame.setAttribute("data-state", "false");
   }

   if (modalGame.getAttribute("data-state") === "false") {
      modalGame.setAttribute("data-state", "true");
      modalGame.style.display = "flex";
      component.forEach(el => el.style.filter = "blur(10px)");
      handleModalTypeUpdate(type);
   } else {
      modalGame.setAttribute("data-state", "false");
      modalGame.style.display = "none";
      component.forEach(el => el.style.filter = "none");
   }
}

/***
   @void - this function checks that modal has been called.
****/
function handleModalTypeUpdate(type) {
   let cardBody = document.querySelector(".modal_game_control .card-body"),
      cardHeader = document.querySelector(".modal_game_control .card-header");

   if (type == "config") {
      ConfigModalComponent(cardHeader, cardBody);
   }

   if (type == "about") {
      AboutModalComponent(cardHeader, cardBody);
   }

   if (type == "winner" || type == "tied") {
      WinnerOrTiedModalComponent(type, cardHeader, cardBody);
   }
}

function ConfigModalComponent(header, body) { 
   header.innerHTML = `
      <h4 id="info-description"><i class="fas fa-clipboard-list"></i> Game actions</h4> 
      <i onclick="handleToggleModal()" class="fas fa-times btn-close-Modal"></i>
   `;

   body.innerHTML = ` 
      <div class="card-control">
         <i onclick="logoutGame()" class="fas fa-home btn-action-modal btn"></i>
         <i onclick="retryGame()" class="fas fa-redo-alt btn-action-modal btn"></i>
         <i onclick="toggleModalVolume()" class="fas fa-music btn-action-modal btn"></i>
      </div>
   `;
}

function AboutModalComponent(header, body){
   header.innerHTML = `
         <h4 id="info-description"><i class="fas fa-info-circle"></i> About the game</h4> 
         <i onclick="handleToggleModal()" class="fas fa-times btn btn-close-Modal"></i>`;
   body.innerHTML = `
   <div class="card-info style-scroll">
      <p>This demo is developed with HTML, CSS and JAVASCRiPT</p>
      <p class="cl-text"><b>- Creator and designer by:</b></p>
      <p>Heibert Ocana</p>
      <p class="cl-text"><b>- Social Networks:</b></p>
      <a target="_blank" class="icon-link" href="https://www.linkedin.com/in/heibert-joseph-oca%C3%B1a-rodr%C3%ADguez-1a29871b7/"><i class="fab fa-linkedin"></i> LinkedIn</a>
      <p class="cl-text"><b>- Repository of the project:</b></p>
      <a target="_blank" class="icon-link" href="https://github.com/HeibertOca97/game-tic-tac-toe"><i class="fab fa-github"></i> GitHub</a>
      <p class="alert-box"><i class="fas fa-info-circle"></i> In advance, excuse my writing in English, if you find it a bit strange!</p>
      <p class="cl-text"><b>- Description:</b></p>
      <p>Three in a row (also known as "Tres en raya" by Hispanics), is a pencil and paper game between two players: O and X, who alternately mark the spaces on a 3x3 board.</p>
      <p class="cl-text"><b>- Observations before playing:</b></p>
      <p>1. Once you've checked the cell, can't you uncheck it?</p>
      <p>2. You have an options panel where you can change the order to start playing among other actions.</p>
      <p>3. You will be able to see the marker of how many times you have won as tied.</p>
   </div>
      `;
}

function WinnerOrTiedModalComponent(title, header, body) {
   header.innerHTML = `
   <h4 id="info-description"><i class="fas ${title == 'winner' ? 'fa-trophy' : 'fa-hands-helping'}"></i> Game ${title}</h4> 
      `;
   body.innerHTML = `
   <div class="card-info">
      ${gameClass.statusMessage}            
   </div>
      <div class="card-control">
         <i onclick="logoutGame()" class="fas fa-home btn btn-action-modal"></i>
         <i onclick="retryGame()" class="fas fa-redo-alt btn btn-action-modal"></i>
      </div>
      `;
}

btnPlayMusic.addEventListener("click", controlAudioMuteAndPlay);
btnGameStart.addEventListener("click", () => { 
   handleChangeGameScreen("none", "block");
   document.querySelector(".game_first_display").setAttribute("data-state", "false");
   gameStart();
   audioBox.autoplay = false;
   audioBox.loop = false;
   audioBox.load();
});

document.addEventListener("DOMContentLoaded", () => {
   handleAutoPlaySoundValitation();
   handleChangeGameScreen('flex', 'none')
});
