const gameContainer = document.getElementById("game");
const gamePage = document.getElementById("gamePage");
const scoreBoard = document.querySelector('h2');
const startBtn = document.querySelector('#startBtn');
const startPageContainer = document.querySelector('#startPage');
const hiScoreBoard = document.querySelector('#hiScore');
const gameOptionsContainer = document.querySelector('form');
const cards = gameContainer.getElementsByTagName("div");
const restartBtn = document.querySelector('#restartBtn');
const agentRange = document.querySelector('input[type=range]');


const AGENTS = [
  'Breach',		
  'Brimstone',
  'Cypher',	
  'Jett',
  'Omen',		
  'Phoenix',		
  'Raze',		
  'Reyna',	
  'Sage',	
  'Sova',		
  'Viper',		
  'Astra',		
  'KAYO',		
  'Killjoy',		
  'Skye',		
  'Yoru',
  'Chamber',
  'Neon',
  'Fade',
]
  

let score = 0;
let previousCard;
let cardsFlipped = 0;
let difficultyLevel = displayDifficulty();
let hiScore = localStorage.getItem(`${difficultyLevel}hiScore`) || 0;
updateHiScore();

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}


let shuffledAgents = shuffle(AGENTS);
let currentGameDeck = selectAgents(shuffledAgents,agentRange.value);
//need to decide how to layout the cards depending on the difficulty/number of cards being played
//setGameContainerSize();

// counter to see if the game is finished
let gameDone = currentGameDeck.length/2;
// when the DOM loads
displayDifficulty();
createDivsForAgents(currentGameDeck);
startBtn.addEventListener("click",startGame);
document.querySelector("#changeBtn").addEventListener("click",restartGame);
restartBtn.addEventListener("click",restartGame);
agentRange.addEventListener("input",displayDifficulty);

// this function loops over the array of Agents
// it creates a new div and gives it a name with the value of the Agent
// it also adds an event listener for a click for each card
function createDivsForAgents(agentsArray) {
// using a regular for loop instead of for...of loop to give each card a unique ID (variable i) to prevent double clicks
  for (let i=0; i<agentsArray.length; i++) {
   
    const newDiv = document.createElement("div");
 
    // give it a name attribute for the value(Agents) we are looping over
    newDiv.setAttribute('name',`${agentsArray[i]}`);
   
    //give each card a unique ID to prevent double clicks
    newDiv.setAttribute('id', `${i}`);
    
    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);
    // give a class attribute so we can set the back of the card when we flip it
    newDiv.classList.add('background');

    // append the div(cards) to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// Main function to handle the click event when a card is clicked.
function handleCardClick(event) {
  //if we finished the current game dont do anything
  if( gameDone ){
    //If we have 2 non-matched cards flipped over, dont do anything.
    if(cardsFlipped == 2){
      return;
    } 
    const currentCard= event.target;
    //if the cards are already matched dont do anything
    if(currentCard.classList[2]==='matched'){
      return;
    }
    //If we clicked the same card twice. Don't do anything.
    if(areSameCards()){
        //cardsFlipped--;
        return;
    }
    // you can use event.target to see which element was clicked
    console.log("you just clicked", event.target.classList[0]);
    flipCard(event.target);
    // If previousCard is null(falsey) set previousCard to what we just clicked.
    if(!previousCard){
      previousCard = event.target;
      updateScore();
    }

    else if(currentCard.getAttribute('name') === previousCard.getAttribute('name')) {
      score++;
      gameDone--;
      cardsFlipped=0;
      currentCard.classList.add('matched');
      previousCard.classList.add('matched');
      console.log(gameDone);
      previousCard = '';
      updateScore();
      isGameDone();
    }
    else {
      score++;
      setTimeout(flipCardBack,1000,event.target);
      setTimeout(flipCardBack,1000,previousCard);
      previousCard = '';
      updateScore();
    }
  }
  
}



//Flips card face up to reveal the color
function flipCard(card){
  card.style.backgroundImage =`url('AgentPortraits/${card.getAttribute('name')}.webp')`;
  card.classList.toggle('flip');
  cardsFlipped++;
  console.log('cardflipped');
}

//Flips the card back facedown
function flipCardBack(card){
    card.classList.toggle('flip');
    card.style.backgroundImage = "url('AgentPortraits/ValorantLogo3.svg')";
    cardsFlipped--;
}  

//Updates the score
function updateScore(){
  scoreBoard.innerText = `Score: ${score}`;
}

//Updates the High Score.
function updateHiScore(){
  hiScoreBoard.innerText = `${difficultyLevel} High Score: ${hiScore}`;
}

//function to check if the game is done.

function isGameDone(){
  if(gameDone <= 0 && (score < hiScore || hiScore === 0)){
    console.log("game is done");
    localStorage.setItem(`${difficultyLevel}hiScore`,`${score}`);
    hiScore = localStorage.getItem(`${difficultyLevel}hiScore`);
    updateHiScore();
    return true;
  }
  return false;
}

//function returns true if we clicked on the same card consecutively

function areSameCards(){
    if(!previousCard){ //If this is the first card clicked in the game (previousCard is empty/falsey) or the card clicked is not the same return false
      return false;
    } 
    else {
      try{ //try/finally needed here as previousCard is not defined yet when we click the first card in the game.
        if (event.target.getAttribute('id')===previousCard.getAttribute('id')){
          return true;
        }
      } 
      catch{
        return false;
      }
      
    } 
  }

//Function to hide the start page and show the game page.
function startGame(){
  startPageContainer.classList.toggle('hidden');
  gamePage.classList.toggle('hidden');
  gameOptionsContainer.classList.toggle('hidden');
}

//Function to reset the game
function restartGame(){
  //reset all relevent variables/counters to default values
  difficultyLevel = displayDifficulty();
  score=0;
  updateScore();
  cardsFlipped = 0;
  previousCard='';
  //flip cards back down
  for(i=cards.length-1;i>=0;i--){
    cards[i].remove();
  }

  shuffledAgents = shuffle(AGENTS);
  currentGameDeck = [];
  currentGameDeck = selectAgents(shuffledAgents,agentRange.value);
  // counter to see if the game is finished
  gameDone = currentGameDeck.length/2;
  // when the DOM loads
  //setGameContainerSize(); //function to change gamecontainer width
  createDivsForAgents(currentGameDeck);
  hiScore = localStorage.getItem(`${difficultyLevel}hiScore`) || 0;
  updateHiScore();
  //hiScoreBoard.innerText = `${difficultyLevel} High Score: ${localStorage.getItem(`${difficultyLevel}hiScore`) || 0}`;
}

/*
function setGameContainerSize(){
  if (currentGameDeck.length % 7 === 0 ){
    gameContainer.style.width = '1020px';
  } 
}
*/


//function to 
function selectAgents(array,number){
  let numberOfAgents = agentRange.value;
  let selectedAgentsArray = [];
  // from a shuffled array of 19 agents create a new Array with a specified number of agents and each agent doubled to create matching pairs
  for(i=0; i < numberOfAgents ;i++){
    selectedAgentsArray[i*2]=array[i];
    selectedAgentsArray[i*2 + 1 ]=array[i];
  }
  //shuffle selectedAgentsArray since matching Agents are added next to each other.
  shuffle(selectedAgentsArray);
  return selectedAgentsArray;
}

//Function to display and return value of the difficulty slider converted to a difficulty rank.
function displayDifficulty(){
  const difficultyDisplay = document.querySelector('#difficultyDisplay');
  switch(agentRange.value){
    case '5':
      difficultyDisplay.innerText = 'Iron';
      difficultyDisplay.style.color = 'grey';
      return difficultyDisplay.innerText;
    case '7':
      difficultyDisplay.innerText = 'Bronze';
      difficultyDisplay.style.color = 'Sienna';
      return difficultyDisplay.innerText;    
    case '9':
      difficultyDisplay.innerText = 'Silver';
      difficultyDisplay.style.color = 'Silver';
      return difficultyDisplay.innerText;
    case '11':
      difficultyDisplay.innerText = 'Gold';
      difficultyDisplay.style.color = 'Gold';
      return difficultyDisplay.innerText;
    case '13':
      difficultyDisplay.innerText = 'Platinum';
      difficultyDisplay.style.color = '#1f5d6c';
      return difficultyDisplay.innerText; 
    case '15':
      difficultyDisplay.innerText = 'Diamond';
      difficultyDisplay.style.color = 'MediumOrchid';
     return difficultyDisplay.innerText;; 
    case '17':
      difficultyDisplay.innerText = 'Immortal';
      difficultyDisplay.style.color = 'Maroon';
      return difficultyDisplay.innerText;
    case '19':
      difficultyDisplay.innerText = 'Radiant';
      difficultyDisplay.style.color = 'PaleGoldenRod';
      return difficultyDisplay.innerText;
}
}
/* */