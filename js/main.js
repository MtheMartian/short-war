const MyURL ={
  newDeckURL: "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
  deckId: "",
  playerOneImg: document.querySelector('.player-one-card'),
  playerTwoImg: document.querySelector('.player-two-card'),
  drawThemCards: document.querySelector('button'),
  playerWinHUD: document.querySelector('h2'),
  cardInPileImg: document.createElement('img'), 
  didWarOccur: false,
  storeSixCards: []
}

MyURL.drawThemCards.onclick = drawCards;
   
fetch(MyURL.newDeckURL)
   .then(function(response){
    return response.json();
   })
   .then(data =>{
    console.log(data);
    MyURL.deckId = data.deck_id
   })

   .catch(error =>{
    console.log(`Error: ${error}`);
   })

function drawCards(){
fetch(`https://www.deckofcardsapi.com/api/deck/${MyURL.deckId}/draw/?count=2`)   
.then(function(response){
  return response.json();
})
.then(data =>{
  console.log(data);
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
    MyURL.playerWinHUD.innerText = "Player 1 Won!";
    fetch(`https://www.deckofcardsapi.com/api/deck/${MyURL.deckId}/pile/player1/add/?cards=${secondCard.code}`)
    .then(function(response){
      return response.json();
    })
    .then(data => {
      console.log(data);
    })

    .catch(error => {
      console.log(`Error: ${error}`);
    })
    playerOnePileImg(secondCard);
    if(MyURL.didWarOccur != false){
      for(let i = 0; i <= 2; i++){
      document.querySelector('.player-one-cards').remove();
      document.querySelector('.player-two-cards').remove();
      }
      pOneWarWinAward(MyURL.storeSixCards);
      playerOneWarWinImg(MyURL.storeSixCards);
      MyURL.didWarOccur = false;
    }
  }
  else if(secondCardVal > firstCardVal){
    MyURL.playerWinHUD.innerText = "Player 2 Won!";
    fetch(`https://www.deckofcardsapi.com/api/deck/${MyURL.deckId}/pile/player2/add/?cards=${firstCard.code}`)
    .then(function(response){
      return response.json();
    })
    .then(data => {
      console.log(data);
    })

    .catch(error => {
      console.log(`Error: ${error}`);
    })
    playerTwoPileImg(firstCard);
    if(MyURL.didWarOccur != false){
      for(let i = 0; i <= 2; i++){
        document.querySelector('.player-one-cards').remove();
        document.querySelector('.player-two-cards').remove();
        }
        pTwoWarWinAward(MyURL.storeSixCards);
        playerTwoWarWinImg(MyURL.storeSixCards);
      MyURL.didWarOccur = false;
    }
  }
  else{
    MyURL.playerWinHUD.innerText = "WAR!!";
    drawSixCards();
    MyURL.didWarOccur = true;
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
  fetch(`https://www.deckofcardsapi.com/api/deck/${MyURL.deckId}/draw/?count=6`)   
.then(function(response){
  return response.json();
})
.then(data =>{
  console.log(data);
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
  arr.forEach(function(x, i){
    fetch(`https://www.deckofcardsapi.com/api/deck/${MyURL.deckId}/pile/player1/add/?cards=${arr[i].code}`)
    .then(function(response){
      return response.json();
    })
    .then(data => {
      console.log(data);
    })

    .catch(error => {
      console.log(`Error: ${error}`);
    })
  })
}

function pTwoWarWinAward(arr){
  arr.forEach(function(x, i){
    fetch(`https://www.deckofcardsapi.com/api/deck/${MyURL.deckId}/pile/player2/add/?cards=${arr[i].code}`)
    .then(function(response){
      return response.json();
    })
    .then(data => {
      console.log(data);
    })

    .catch(error => {
      console.log(`Error: ${error}`);
    })
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






  
   
