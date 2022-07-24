const MyURL ={
  newDeckURL: "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
  deckId: "",
  playerOneImg: document.querySelector('.player-one-card'),
  playerTwoImg: document.querySelector('.player-two-card'),
  firstPlayer: document.querySelector('#firstPlayer'),
  secondPlayer: document.querySelector('#secondPlayer'),
  instructionPageBtn: document.querySelector('#instructionPageBtn'),
  instructionPage: document.querySelector('#instructionPage'),
  cardInPileImg: document.createElement('img'), 
  hideIt: document.querySelector('.hidden'),
  background: document.querySelector('#background'),
  scoreHUD: document.querySelector('#scoreHUD'),
  faceDownPlayerOne: document.querySelector('#player-one-spot'),
  faceDownPlayerTwo: document.querySelector('#player-two-spot'),
  playerOneScore: document.querySelector('#playerOneScore > span'),
  playerTwoScore: document.querySelector('#playerTwoScore > span'),
  scores: document.querySelector('#scoreContainer'),
  didSomeoneWin: false,
  didWarOccur: false,
  iUnderstood: false,
  isLayerOn: false,
  cardsFaceDownPresent: false,
  storeSixCards: [],
  storePlayerOnePile: [],
  storePlayerTwoPile: [],
  cardsremainingMainDeck: 0,
  cardsInPileOne: 0,
  cardsInPileTwo: 0
}

window.addEventListener('keydown', event =>{
  if(event.code == "KeyR"){
    localStorage.clear();
    location.reload();
  }
})

if(localStorage.getItem('playerOneScore') == null && localStorage.getItem('playerTwoScore') == null){
  localStorage.setItem('playerOneScore', MyURL.playerOneScore.textContent);
  localStorage.setItem('playerTwoScore', MyURL.playerTwoScore.textContent);
  document.querySelector('#pressSpacebar').classList.add('hidden'); 
}
else{
  hideInstructions();
  MyURL.playerOneScore.textContent = localStorage.getItem('playerOneScore');
  MyURL.playerTwoScore.textContent = localStorage.getItem('playerTwoScore');
}

MyURL.instructionPageBtn.addEventListener('click', hideInstructions);
MyURL.playerOneImg.classList.add('hidden');
MyURL.playerTwoImg.classList.add('hidden');
MyURL.firstPlayer.classList.add('hidden');
MyURL.secondPlayer.classList.add('hidden');
MyURL.scores.classList.add('hidden');
window.addEventListener('keydown', event =>{
  if(event.code == "Space" && MyURL.iUnderstood && MyURL.isLayerOn == false){
  document.querySelector('#pressSpacebar').classList.add('hidden');  
  event.preventDefault();
  MyURL.firstPlayer.classList.remove('hidden');
  MyURL.secondPlayer.classList.remove('hidden');
  MyURL.playerOneImg.classList.remove('hidden');
  MyURL.playerTwoImg.classList.remove('hidden');
  MyURL.scores.classList.remove('hidden');
  if(MyURL.cardsremainingMainDeck == 0 && MyURL.cardsInPileOne > MyURL.cardsInPileTwo)
  {
    MyURL.scoreHUD.style.color = "azure";
    MyURL.scoreHUD.innerText = "Player 1 Won!";
    MyURL.background.classList.remove('hidden');
    if(MyURL.didSomeoneWin == false){
      MyURL.playerOneScore.textContent = (Number(MyURL.playerOneScore.textContent) + 1);
    }
    MyURL.didSomeoneWin = true; 
    localStorage.setItem('playerOneScore', MyURL.playerOneScore.textContent);
  }
  else if(MyURL.cardsremainingMainDeck == 0 && MyURL.cardsInPileOne < MyURL.cardsInPileTwo){  
    MyURL.scoreHUD.style.color = "azure";
    MyURL.scoreHUD.innerText = "Player 2 Won!";
    MyURL.background.classList.remove('hidden');
    if(MyURL.didSomeoneWin == false){
      MyURL.playerTwoScore.textContent = (Number(MyURL.playerTwoScore.textContent) + 1);
    } 
    MyURL.didSomeoneWin = true;
    localStorage.setItem('playerTwoScore', MyURL.playerTwoScore.textContent);
  }
  else if(MyURL.cardsremainingMainDeck == 0 && MyURL.cardsInPileOne == MyURL.cardsInPileTwo){
    MyURL.scoreHUD.style.color = "azure";
    MyURL.scoreHUD.innerText = "DRAW!";
    MyURL.background.classList.remove('hidden');
  }
  else{
    fetch(`https://www.deckofcardsapi.com/api/deck/${MyURL.deckId}/draw/?count=2`)   
.then(function(response){
  return response.json();
})
.then(data =>{
  MyURL.cardsremainingMainDeck = data.remaining;
  MyURL.playerOneImg.src = data.cards[0].image;
  MyURL.playerTwoImg.src = data.cards[1].image;
  const firstCard = data.cards[0];
  const secondCard = data.cards[1];
  const firstCardVal = convertToNumbers(firstCard.value);
  const secondCardVal = convertToNumbers(secondCard.value);
  compareCards(firstCardVal, secondCardVal, secondCard, firstCard);
})

.catch(error =>{
  console.log(`Error: ${error}`);
})
  }
  }
})
   
fetch(MyURL.newDeckURL)
   .then(function(response){
    return response.json();
   })
   .then(data =>{
    MyURL.deckId = data.deck_id
    MyURL.cardsremainingMainDeck = data.remaining;
   })

   .catch(error =>{
    console.log(`Error: ${error}`);
   })

MyURL.scoreHUD.addEventListener('click', hideBackground);

function convertToNumbers(val){
  switch(val){
    case "ACE": 
    return 14;
    
    case "KING":
    return 13;

    case "QUEEN":
    return 12;

    case "JACK":
    return 11;

    default:
      return parseInt(val);
  }
}

function compareCards(firstCardVal, secondCardVal, secondCard, firstCard){
  if(firstCardVal > secondCardVal){
    checkIfCardsFaceDownPresent();
    MyURL.storePlayerOnePile.push(secondCard);
    fetch(`https://www.deckofcardsapi.com/api/deck/${MyURL.deckId}/pile/player1/add/?cards=${secondCard.code}`)
    .then(function(response){
      return response.json();
    })
    .then(data => {
      MyURL.cardsInPileOne = data.piles.player1.remaining;
    })

    .catch(error => {
      console.log(`Error: ${error}`);
    })
    playerOnePileImg(secondCard);
    if(MyURL.cardsFaceDownPresent){
      for(let i = 0; i <= 2; i++){
      document.querySelector('.player-one-cards').remove();
      document.querySelector('.player-two-cards').remove();
      }
      pOneWarWinAward(MyURL.storeSixCards);
      playerOneWarWinImg(MyURL.storeSixCards);
      MyURL.didWarOccur = false;
      MyURL.scoreHUD.innerText = "";
    }
  }
  else if(secondCardVal > firstCardVal){
    checkIfCardsFaceDownPresent();
    MyURL.storePlayerTwoPile.push(firstCard);
    fetch(`https://www.deckofcardsapi.com/api/deck/${MyURL.deckId}/pile/player2/add/?cards=${firstCard.code}`)
    .then(function(response){
      return response.json();
    })
    .then(data => {
      MyURL.cardsInPileTwo = data.piles.player2.remaining;
    })

    .catch(error => {
      console.log(`Error: ${error}`);
    })
    playerTwoPileImg(firstCard);
    if(MyURL.cardsFaceDownPresent){
      for(let i = 0; i <= 2; i++){
        document.querySelector('.player-one-cards').remove();
        document.querySelector('.player-two-cards').remove();
        }
        pTwoWarWinAward(MyURL.storeSixCards);
        playerTwoWarWinImg(MyURL.storeSixCards);
      MyURL.didWarOccur = false;
      MyURL.scoreHUD.innerText = "";
    }
  }
  else{
    MyURL.didWarOccur = true;
    MyURL.isLayerOn = true;
    MyURL.background.classList.remove('hidden');
    MyURL.scoreHUD.innerText = "WAR!!";
    MyURL.scoreHUD.style.color = "red";
    drawSixCards(); 
  }
}

function playerOnePileImg(secondCard){
  const playerOnePile = document.querySelector('#first-pile').appendChild(MyURL.cardInPileImg.cloneNode());
  playerOnePile.className = "player-one-pile";
  playerOnePile.src = secondCard.image;
}

function playerTwoPileImg(firstCard){
  const playerTwoPile = document.querySelector('#second-pile').appendChild(MyURL.cardInPileImg.cloneNode());
  playerTwoPile.className = "player-two-pile";
  playerTwoPile.src = firstCard.image;
}

function drawSixCards(){
  MyURL.cardsFaceDownPresent = true;
  fetch(`https://www.deckofcardsapi.com/api/deck/${MyURL.deckId}/draw/?count=6`)   
.then(function(response){
  return response.json();
})
.then(data =>{
  const firstCard = data.cards[0];
  playerOneCardsWarImg();
  const secondCard = data.cards[1];
  playerOneCardsWarImg();
  const thirdCard = data.cards[2];
  playerOneCardsWarImg();
  const fourthCard = data.cards[3];
  playerTwoCardsWarImg();
  const fifthCard = data.cards[4];
  playerTwoCardsWarImg();
  const sixthCard = data.cards[5];
  playerTwoCardsWarImg();

  MyURL.storeSixCards.push(firstCard, secondCard, thirdCard, fourthCard, fifthCard, sixthCard);
})

.catch(error =>{
  console.log(`Error: ${error}`);
})
}

function playerOneCardsWarImg(){
  const warCardsImg = document.querySelector('#player-one-spot').appendChild(MyURL.cardInPileImg.cloneNode());
  warCardsImg.className = "player-one-cards";
  warCardsImg.src = "cardbackorange.png";
}

function playerTwoCardsWarImg(){
  const warCardsImg = document.querySelector('#player-two-spot').appendChild(MyURL.cardInPileImg.cloneNode());
  warCardsImg.className = "player-two-cards";
  warCardsImg.src = "cardbackorange.png";
}

function pOneWarWinAward(arr){
  let cards = arr;
  cards.forEach(function(x, i){
    MyURL.storePlayerOnePile.push(cards[i]);
  })
  fetch(`https://www.deckofcardsapi.com/api/deck/${MyURL.deckId}/pile/player1/add/?cards=${cards[0].code},${cards[1].code},${cards[2].code},${cards[3].code},${cards[4].code},${cards[5].code}`)
    .then(function(response){
      return response.json();
    })
    .then(data => {
      console.log(data);
      MyURL.cardsInPileOne = data.piles.player1.remaining;
    })

    .catch(error => {
      console.log(`Error: ${error}`);
    })
}

function pTwoWarWinAward(arr){
  let cards = arr;
  cards.forEach(function(x, i){
    MyURL.storePlayerOnePile.push(cards[i]);
  })
    fetch(`https://www.deckofcardsapi.com/api/deck/${MyURL.deckId}/pile/player2/add/?cards=${cards[0].code},${cards[1].code},${cards[2].code},${cards[3].code},${cards[4].code},${cards[5].code}`)
    .then(function(response){
      return response.json();
    })
    .then(data => {
      console.log(data);
      MyURL.cardsInPileTwo = data.piles.player2.remaining;
    })

    .catch(error => {
      console.log(`Error: ${error}`);
    })
}

function playerOneWarWinImg(arr){
  arr.forEach(function(x, i){
    const playerOnePile = document.querySelector('#first-pile').appendChild(MyURL.cardInPileImg.cloneNode());
    playerOnePile.className = "player-one-pile";
    playerOnePile.src = arr[i].image;
  })
}

function playerTwoWarWinImg(arr){
  arr.forEach(function(x, i){
    const playerOnePile = document.querySelector('#second-pile').appendChild(MyURL.cardInPileImg.cloneNode());
    playerOnePile.className = "player-two-pile";
    playerOnePile.src = arr[i].image;
  })
}

function hideBackground(){
  MyURL.scoreHUD.innerText = "";
  MyURL.background.classList.add('hidden');
  MyURL.isLayerOn = false;
}

function hideInstructions(){
  MyURL.instructionPage.classList.add('hidden');
  document.querySelector('#pressSpacebar').classList.remove('hidden');
  MyURL.iUnderstood = true;
}

function checkIfCardsFaceDownPresent(){
  const playerOneNumOfFaceDownCards = MyURL.faceDownPlayerOne.childElementCount;
  const playerTwoNumOfFaceDownCards = MyURL.faceDownPlayerTwo.childElementCount;
  if(playerOneNumOfFaceDownCards == 0 && playerTwoNumOfFaceDownCards == 0){
    MyURL.cardsFaceDownPresent = false;
  }
  else{
    MyURL.cardsFaceDownPresent = true;
  }
  }





  
   
