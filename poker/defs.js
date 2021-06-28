 const maxCards = 7

 const pokerSuits = {
  0: "♦️",
  1: "♣️",
  2: "♥️",
  3: "♠️"
}

 const pokerRanks = {
  0: "2",
  1: "3",
  2: "4",
  3: "5",
  4: "6",
  5: "7",
  6: "8",
  7: "9",
  8: "10",
  9: "J",
  10: "Q",
  11: "K",
  12: "A",
}

 const pokerCombinations = {
  0: "High Card",
  1: "Pair",
  2: "Two Pair",
  3: "Three of A Kind", 
  4: "Straight",
  5: "Flush",
  6: "Full House",
  7: "Four of A Kind",
  8: "Straight Flush",
  9: "Royal Flush",
}


 const NUM_CARDS_IN_DECK = 52

 const NUM_VALUES_IN_DECK = 13

 const NUM_SUITS_IN_DECK = 4

 const MIN_PLAYER_TO_START = 1

//states
 const WAITING_FOR_PLAYER = 0
 const ROUND_START = -1
 const BLIND_BET_ROUND = 1
 const FLOP_BET_ROUND = 2
 const TURN_BET_ROUND = 3
 const RIVER_BET_ROUND = 4
 const SHOW_DOWN_ROUND = 5

module.exports = {maxCards, pokerRanks, pokerSuits, pokerCombinations, NUM_CARDS_IN_DECK, NUM_SUITS_IN_DECK, NUM_VALUES_IN_DECK, MIN_PLAYER_TO_START, WAITING_FOR_PLAYER, ROUND_START, BLIND_BET_ROUND, FLOP_BET_ROUND, RIVER_BET_ROUND, TURN_BET_ROUND, SHOW_DOWN_ROUND}