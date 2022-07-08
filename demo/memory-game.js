"use strict";

// a counter to easily determine when to shift rows that we are adding cards to.
let cellCount = 0;
let serializer = 0;


/*
cardDeck will hold an object per card, storying unique values. status, click order, serial.
bordStatus describes the count of cards currently flipped, CurrentCard holds the ID of the
 first picked. Matched cards keeps count of the game.

*/
let cardDeck = {
  bordStatus: 0,
  firstCardId: 0,
  firstCardColor: '',
  secondCardId: 0,
  secondCardColor: '',
  matchedCards: 0
};

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const colors = shuffle(COLORS);

createCards(colors);


/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");
  const firstRow = document.getElementById("row1");
  const secRow = document.getElementById("row2");

  for (let color of colors) {

    const cardCreation = document.createElement('div');

    cardCreation.setAttribute('class', `${color}-off all-cards`);
    cardCreation.setAttribute('id', `${serializer}`);

    cardDeck[serializer] = {
      status: 'off',
      color: `${color}`
    }

    serializer++;

    cardCreation.addEventListener('click', function (e) {
      handleCardClick(e);
    });

    if (cellCount < 5) {
      firstRow.append(cardCreation);
      cellCount++;
    } else {
      secRow.append(cardCreation);
    }
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  card.target.className = cardDeck[card.target.id].color;
}

/** Flip a card face-down. */

function unFlipCard(cardId) {
  console.log("unflip initiated");
  const cardNode = document.getElementById(cardId);

  cardNode.setAttribute('class', `${cardDeck[cardId].color + "-off"}`);

  console.log("unflip completed");

}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt) {
  // checks if appropriate to allow flipping card, and does if so.
  if (cardDeck.bordStatus === 0) {
    cardDeck.bordStatus = 1;
    cardDeck.firstCardId = evt.target.id;
    cardDeck.firstCardColor = cardDeck[evt.target.id].color;
    flipCard(evt);
  } else if (cardDeck.bordStatus === 1 && evt.target.id !== cardDeck.currentCardId) {
    cardDeck.bordStatus = 2;
    cardDeck.secondCardId = evt.target.id;
    cardDeck.secondCardColor = cardDeck[evt.target.id].color;
    flipCard(evt)
  };

  // get back to correctly referencing

  // if card does not match, unflip 
  setTimeout(function () {
    console.log("timeout started");
    console.log(cardDeck);
    if (cardDeck.bordStatus === 2 && cardDeck.firstCardColor !== cardDeck.secondCardColor) {
      unFlipCard(cardDeck.firstCardId);
      unFlipCard(cardDeck.secondCardId);
      
    }

    // if cards do match secure and reset {potentially add winning class styling in future}
    if (cardDeck.bordStatus === 2 && cardDeck.firstCardColor === cardDeck.secondCardColor) {
      cardDeck.bordStatus = 0;
      cardDeck.matchedCards += 2;
      cardDeck.firstCardId = 0;
      cardDeck.secondCardId = 0;
      cardDeck.firstCardColor = '';
      cardDeck.secondCardColor = '';
      console.log("timeout ended");
      
    } else if (cardDeck.bordStatus === 2) {
      cardDeck.bordStatus = 0;
      cardDeck.firstCardId = 0;
      cardDeck.secondCardId = 0;
      cardDeck.firstCardColor = '';
      cardDeck.secondCardColor = '';
      console.log("timeout ended");
    }
  }, 1000
  )


}

